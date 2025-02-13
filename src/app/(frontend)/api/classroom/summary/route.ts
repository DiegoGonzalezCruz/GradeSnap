// app/api/classroom/summary/route.ts
import { NextResponse } from 'next/server'
import { google, classroom_v1 } from 'googleapis'

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

  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: token })
  const classroom = google.classroom({ version: 'v1', auth })

  try {
    // Fetch courses with only the id field
    const coursesResponse = await classroom.courses.list({
      pageSize: 100,
      fields: 'courses(id)',
    })
    const courses = coursesResponse.data.courses || []
    const totalCourses = courses.length

    // Use Promise.all to fetch assignments and students concurrently with minimal fields
    const courseDataPromises = courses.map(async (course) => {
      if (!course.id) return { assignmentCount: 0, studentCount: 0 }

      const [assignmentsResponse, studentsResponse] = await Promise.all([
        classroom.courses.courseWork
          .list({
            courseId: course.id,
            fields: 'courseWork(id)',
          })
          .catch((err) => {
            console.error(`Error fetching assignments for course ${course.id}`, err)
            return { data: { courseWork: [] } }
          }),
        classroom.courses.students
          .list({
            courseId: course.id,
            fields: 'students(userId)',
          })
          .catch((err) => {
            console.error(`Error fetching students for course ${course.id}`, err)
            return { data: { students: [] } }
          }),
      ])

      const assignmentCount = (assignmentsResponse.data.courseWork || []).length
      const studentCount = (studentsResponse.data.students || []).length

      return { assignmentCount, studentCount }
    })

    const results = await Promise.all(courseDataPromises)
    const totalAssignments = results.reduce((sum, result) => sum + result.assignmentCount, 0)
    const totalStudents = results.reduce((sum, result) => sum + result.studentCount, 0)

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
