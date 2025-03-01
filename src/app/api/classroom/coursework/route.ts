import { NextResponse, NextRequest } from 'next/server'
import { google } from 'googleapis'
import { getUserAccessToken } from '../../auth/google/getUserAccessToken'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get('courseId')
  if (!courseId) {
    return NextResponse.json({ error: 'Missing courseId query parameter.' }, { status: 400 })
  }

  const token = await getUserAccessToken(req)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized. No access token available.' }, { status: 401 })
  }

  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: token })
  const classroom = google.classroom({ version: 'v1', auth })

  try {
    // Fetch coursework and student submissions in parallel
    const [courseWorkResponse, studentsResponse] = await Promise.allSettled([
      classroom.courses.courseWork.list({ courseId }),
      classroom.courses.students.list({ courseId }), // Fetch students for potential future use
    ])

    if (courseWorkResponse.status !== 'fulfilled' || !courseWorkResponse.value.data.courseWork) {
      return NextResponse.json({ error: 'Failed to fetch coursework' }, { status: 500 })
    }

    const courseWorkItems = courseWorkResponse.value.data.courseWork || []

    // Fetch student submissions for all coursework items in parallel
    const submissionData = await Promise.allSettled(
      courseWorkItems.map(async (courseWork) => {
        try {
          const submissionsResponse = await classroom.courses.courseWork.studentSubmissions.list({
            courseId,
            courseWorkId: courseWork.id as string,
          })
          return {
            courseWorkId: courseWork.id,
            submissions: submissionsResponse.data.studentSubmissions || [],
          }
        } catch (error) {
          console.error(`Error fetching submissions for coursework ${courseWork.id}:`, error)
          return { courseWorkId: courseWork.id, submissions: [] }
        }
      }),
    )

    // Map submission data to coursework
    const enrichedCourseWork = courseWorkItems.map((courseWork) => {
      const submissionInfo = submissionData.find(
        (sub) => sub.status === 'fulfilled' && sub.value.courseWorkId === courseWork.id,
      )
      const submissions =
        submissionInfo?.status === 'fulfilled' ? submissionInfo.value.submissions : []

      const { totalSubmissions, gradedSubmissions, ungradedSubmissions } = submissions.reduce(
        (counts, submission) => {
          if (submission.state === 'TURNED_IN' || submission.state === 'RETURNED') {
            counts.gradedSubmissions++
          } else {
            counts.ungradedSubmissions++
          }
          counts.totalSubmissions++
          return counts
        },
        { totalSubmissions: 0, gradedSubmissions: 0, ungradedSubmissions: 0 },
      )

      return {
        ...courseWork,
        totalSubmissions,
        gradedSubmissions,
        ungradedSubmissions,
      }
    })

    return NextResponse.json(enrichedCourseWork, { status: 200 })
  } catch (error) {
    console.error('Error fetching coursework or submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coursework and submissions.' },
      { status: 500 },
    )
  }
}
