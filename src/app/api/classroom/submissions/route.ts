// app/api/classroom/submissions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

// Dummy helper to retrieve the stored access token (modify this to fit your auth flow)
async function getUserAccessToken(req: NextRequest): Promise<string | null> {
  // For instance, if you stored it in cookies:
  const token = req.cookies.get('google_access_token')?.value
  return token || null
}

export async function GET(req: NextRequest) {
  // This endpoint lists student submissions.
  // Expect query params: courseId and courseWorkId
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
      courseId: courseId,
      courseWorkId: courseWorkId,
    })

    const submissions = submissionsResponse.data.studentSubmissions || []

    // Fetch user details for each submission
    const submissionsWithUserDetails = await Promise.all(
      submissions.map(async (submission: any) => {
        try {
          const userResponse = await classroom.userProfiles.get({
            userId: submission.userId,
          })
          return {
            ...submission,
            user: userResponse.data,
            attachments: submission.submissionsubmission?.attachments || [],
          }
        } catch (userError) {
          console.error('Error fetching user details:', userError)
          return {
            ...submission,
            user: null,
            attachments: submission.submissionsubmission?.attachments || [],
          }
        }
      }),
    )

    // The response includes an array of submissions.
    // Each submission may contain attachments (files) under the "submissionsubmission" object.
    return NextResponse.json({ studentSubmissions: submissionsWithUserDetails }, { status: 200 })
  } catch (error) {
    console.error('Error fetching student submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch student submissions.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  // This endpoint grades a student submission.
  // Expects a JSON body with: courseId, courseWorkId, submissionId, assignedGrade
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
    // To grade a submission, you update the "assignedGrade" and can change the state (for example, to 'RETURNED').
    const updateMask = 'assignedGrade,state'
    const patchResponse = await classroom.courses.courseWork.studentSubmissions.patch({
      courseId: courseId,
      courseWorkId: courseWorkId,
      id: submissionId,
      updateMask: updateMask,
      requestBody: {
        assignedGrade: Number(assignedGrade),
        state: 'RETURNED', // Marks the submission as graded/returned.
      },
    })
    return NextResponse.json(patchResponse.data, { status: 200 })
  } catch (error) {
    console.error('Error updating student submission:', error)
    return NextResponse.json({ error: 'Failed to update student submission.' }, { status: 500 })
  }
}
