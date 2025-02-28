import { NextResponse, NextRequest } from 'next/server'
import { google } from 'googleapis'
import { getUserAccessToken } from '../../auth/google/getUserAccessToken'

export async function GET(req: NextRequest) {
  // Expect query params: courseId
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
    // First, fetch the list of coursework items
    const courseWorkResponse = await classroom.courses.courseWork.list({
      courseId,
    })
    const courseWorkItems = courseWorkResponse.data.courseWork || []

    // For each coursework item, fetch student submissions and count them
    const enrichedCourseWork = await Promise.all(
      courseWorkItems.map(async (courseWork) => {
        // Fetch student submissions for this coursework
        const submissionsResponse = await classroom.courses.courseWork.studentSubmissions.list({
          courseId,
          courseWorkId: courseWork.id as string,
        })
        const submissions = submissionsResponse.data.studentSubmissions || []

        // Count graded submissions (assuming graded if assignedGrade is present)
        const gradedCount = submissions.filter(
          (submission) =>
            submission.assignedGrade !== undefined && submission.assignedGrade !== null,
        ).length
        const totalSubmissions = submissions.length
        const ungradedCount = totalSubmissions - gradedCount

        // Return the coursework enriched with submission counts
        return {
          ...courseWork,
          totalSubmissions,
          gradedSubmissions: gradedCount,
          ungradedSubmissions: ungradedCount,
        }
      }),
    )

    return NextResponse.json(enrichedCourseWork, { status: 200 })
  } catch (error) {
    console.error('Error fetching coursework or submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coursework and submissions.' },
      { status: 500 },
    )
  }
}
