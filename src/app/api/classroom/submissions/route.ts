import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { getUserAccessToken } from '../../auth/google/getUserAccessToken'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get('courseId')
  const courseWorkId = searchParams.get('courseWorkId')
  if (!courseId || !courseWorkId) {
    return NextResponse.json(
      { error: 'Missing courseId or courseWorkId query parameters.' },
      { status: 400 },
    )
  }

  const token = await getUserAccessToken(req)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized. No access token available.' }, { status: 401 })
  }

  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: token })
  const classroom = google.classroom({ version: 'v1', auth })

  try {
    const submissionsResponse = await classroom.courses.courseWork.studentSubmissions.list({
      courseId,
      courseWorkId,
    })

    const submissions = submissionsResponse.data.studentSubmissions || []

    // Fetch user details for each submission in parallel
    const submissionsWithUserDetails = await Promise.allSettled(
      submissions.map(async (submission) => {
        if (!submission.userId) {
          console.warn(`Skipping submission with missing userId: ${submission.id}`)
          return {
            ...submission,
            user: null,
            attachments: submission.assignmentSubmission?.attachments || [],
          }
        }
        try {
          const userResponse = await classroom.userProfiles.get({
            userId: submission.userId as string,
          })
          return {
            ...submission,
            user: userResponse.data ?? null,
            attachments: submission.assignmentSubmission?.attachments || [],
          }
        } catch (userError) {
          console.error(`Error fetching user details for userId ${submission.userId}:`, userError)
          return {
            ...submission,
            user: null,
            attachments: submission.assignmentSubmission?.attachments || [],
          }
        }
      }),
    )

    // Extract successful results
    const formattedSubmissions = submissionsWithUserDetails
      .map((result) => (result.status === 'fulfilled' ? result.value : null))
      .filter(Boolean)

    return NextResponse.json({ studentSubmissions: formattedSubmissions }, { status: 200 })
  } catch (error) {
    console.error('Error fetching student submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch student submissions.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  let body
  try {
    body = await req.json()
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const { courseId, courseWorkId, submissionId, assignedGrade } = body
  if (!courseId || !courseWorkId || !submissionId || assignedGrade === undefined) {
    return NextResponse.json(
      { error: 'Missing required fields: courseId, courseWorkId, submissionId, or assignedGrade.' },
      { status: 400 },
    )
  }

  const token = await getUserAccessToken(req)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized. No access token available.' }, { status: 401 })
  }

  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: token })
  const classroom = google.classroom({ version: 'v1', auth })

  try {
    const patchResponse = await classroom.courses.courseWork.studentSubmissions.patch({
      courseId,
      courseWorkId,
      id: submissionId,
      updateMask: 'assignedGrade,state',
      requestBody: {
        assignedGrade: Number(assignedGrade),
        state: 'RETURNED',
      },
    })
    return NextResponse.json(patchResponse.data, { status: 200 })
  } catch (error) {
    console.error(`Error updating submission ${submissionId}:`, error)
    return NextResponse.json({ error: 'Failed to update student submission.' }, { status: 500 })
  }
}
