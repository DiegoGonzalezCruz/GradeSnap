// app/api/classroom/summary/route.ts
import { NextResponse } from 'next/server'
import { google } from 'googleapis'

/**
 * Helper to retrieve the access token from cookies.
 * Adjust this implementation to match how you store the token.
 */
async function getTokenFromCookies(req: Request): Promise<string | null> {
  const cookieHeader = req.headers.get('cookie') || ''
  const match = cookieHeader.match(/google_access_token=([^;]+)/)
  return match ? decodeURIComponent(match[1] as string) : null
}

export async function GET(req: Request) {
  const token = await getTokenFromCookies(req)
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Set up the Google API client
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: token })
  const classroom = google.classroom({ version: 'v1', auth })
  //   console.log(classroom, 'classroom ****')

  try {
    // Fetch courses (up to 100 for this example)
    const coursesResponse = await classroom.courses.list({ pageSize: 100 })
    const courses = coursesResponse.data.courses || []
    const totalCourses = courses.length

    let totalAssignments = 0
    let totalStudents = 0

    // For each course, fetch assignments and students
    for (const course of courses) {
      if (course.id) {
        try {
          const assignmentsResponse = await classroom.courses.courseWork.list({
            courseId: course.id,
          })
          const assignments = assignmentsResponse.data.courseWork || []
          totalAssignments += assignments.length
        } catch (assignmentError) {
          console.error(`Error fetching assignments for course ${course.id}`, assignmentError)
        }
        try {
          const studentsResponse = await classroom.courses.students.list({
            courseId: course.id,
          })
          const students = studentsResponse.data.students || []
          totalStudents += students.length
        } catch (studentError) {
          console.error(`Error fetching students for course ${course.id}`, studentError)
        }
      }
    }

    return NextResponse.json({
      courses: totalCourses,
      assignments: totalAssignments,
      students: totalStudents,
    })
  } catch (error) {
    console.error('Error fetching classroom data', error)
    return NextResponse.json({ error: 'Failed to fetch classroom data' }, { status: 500 })
  }
}
