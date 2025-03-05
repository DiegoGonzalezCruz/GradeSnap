import { NextRequest, NextResponse } from 'next/server'
import { google, classroom_v1 } from 'googleapis'
import { getUserAccessToken } from '@/app/api/auth/google/getUserAccessToken'

// 1) Define the extended type at the top or import it from a separate file:
type ExtendedStudentSubmission = classroom_v1.Schema$StudentSubmission & {
  user?: classroom_v1.Schema$UserProfile | null
  attachments?: classroom_v1.Schema$Attachment[]
}

export async function GET(req: NextRequest) {
  console.log('GET SINGLE SUBMISSION')

  // 1. Parse the URL
  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get('courseId')
  const courseWorkId = searchParams.get('courseWorkId')
  const submissionId = searchParams.get('submissionId')

  console.log('*********')
  console.log(courseId, 'course ID from ENDPOINT ****')
  console.log(courseWorkId, ' courseId ID from ENDPOINT ****')
  console.log(submissionId, 'submission ID from ENDPOINT ****')
  console.log('*********')

  // 2. Validate required query params
  if (!courseId || !courseWorkId || !submissionId) {
    console.log('OUT OF HERE !')
    return NextResponse.json(
      { error: 'Missing courseId, courseWorkId, or submissionId in query params' },
      { status: 400 },
    )
  }

  // 3. Get the user’s access token (via your Google auth flow)
  const token = await getUserAccessToken(req)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized. No access token available.' }, { status: 401 })
  }

  // 4. Configure the OAuth client
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: token })
  const classroom = google.classroom({ version: 'v1', auth })

  try {
    // 5. Request the single submission
    const submissionResponse = await classroom.courses.courseWork.studentSubmissions.get({
      courseId,
      courseWorkId,
      id: submissionId,
    })
    console.log(submissionResponse, '***** DATA *****')
    // Cast the result to our extended type
    let submission: ExtendedStudentSubmission = submissionResponse.data as ExtendedStudentSubmission

    // 6. Optionally fetch user details
    if (submission.userId) {
      try {
        const userResponse = await classroom.userProfiles.get({ userId: submission.userId })
        submission.user = userResponse.data ?? null
      } catch (err) {
        console.error(`Error fetching user details for userId ${submission.userId}:`, err)
        submission.user = null
      }
    } else {
      submission.user = null
    }

    // 7. Handle attachments
    submission.attachments = submission.assignmentSubmission?.attachments || []

    // 8. Return the result
    return NextResponse.json({ submission }, { status: 200 })
  } catch (error) {
    console.error('Error fetching a single submission:', error)
    return NextResponse.json({ error: 'Failed to fetch the single submission' }, { status: 500 })
  }
}
