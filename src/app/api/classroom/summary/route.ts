import { getQueryParam } from '@/utilities/classroom'
import { NextRequest, NextResponse } from 'next/server'
import { getUserAccessToken } from '../../auth/google/getUserAccessToken'

const API_BASE = 'https://classroom.googleapis.com/v1'

interface GoogleCourse {
  id: string
  name: string
}

interface GoogleStudentList {
  students?: { userId: string }[]
}

interface GoogleAssignment {
  id: string
  dueDate?: { year: number; month: number; day: number }
}

interface GoogleSubmissionsList {
  studentSubmissions?: { state: string }[]
}

async function fetchGoogleClassroomAPI<T>(url: string, token: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${await res.text()}`)
    return res.json() as Promise<T>
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    return null
  }
}

async function getCourseSummary(course: GoogleCourse, token: string) {
  try {
    const [studentsData, courseWorkData] = await Promise.allSettled([
      fetchGoogleClassroomAPI<GoogleStudentList>(
        `${API_BASE}/courses/${course.id}/students`,
        token,
      ),
      fetchGoogleClassroomAPI<{ courseWork?: GoogleAssignment[] }>(
        `${API_BASE}/courses/${course.id}/courseWork`,
        token,
      ),
    ])

    const studentCount =
      (studentsData.status === 'fulfilled' && studentsData.value?.students?.length) || 0
    const submissions =
      (courseWorkData.status === 'fulfilled' && courseWorkData.value?.courseWork) || []
    const numSubmissions = submissions.length
    const nextDeadline = getNextDeadline(submissions)

    return {
      courseId: course.id,
      courseName: course.name,
      studentCount,
      numSubmissions,
      nextDeadline,
    }
  } catch (error) {
    console.error(`Error fetching data for course ${course.id}:`, error)
    return { courseId: course.id, error: 'Failed to fetch data' }
  }
}

function getNextDeadline(
  submissions: GoogleAssignment[],
): string | { year: number; month: number; day: number } {
  const sortedSubmissions = submissions
    .filter((a) => a.dueDate !== undefined)
    .map((a) => ({
      date: new Date(`${a.dueDate!.year}-${a.dueDate!.month}-${a.dueDate!.day}`),
      dueDate: a.dueDate!,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  return sortedSubmissions[0]?.dueDate ?? 'No upcoming deadlines'
}

async function getCourseDetails(courseId: string, token: string) {
  try {
    const [courseData, studentsData, courseWorkData] = await Promise.allSettled([
      fetchGoogleClassroomAPI<GoogleCourse>(`${API_BASE}/courses/${courseId}`, token),
      fetchGoogleClassroomAPI<GoogleStudentList>(`${API_BASE}/courses/${courseId}/students`, token),
      fetchGoogleClassroomAPI<{ courseWork?: GoogleAssignment[] }>(
        `${API_BASE}/courses/${courseId}/courseWork`,
        token,
      ),
    ])

    const studentCount =
      (studentsData.status === 'fulfilled' && studentsData.value?.students?.length) || 0
    const submissions =
      (courseWorkData.status === 'fulfilled' && courseWorkData.value?.courseWork) || []
    const numSubmissions = submissions.length
    const nextDeadline = getNextDeadline(submissions)
    const submissionStats = await getSubmissionStats(courseId, submissions, token)

    return {
      courseName:
        courseData.status === 'fulfilled' && courseData.value ? courseData.value.name : 'Unknown',
      studentCount,
      numSubmissions,
      nextDeadline,
      ...submissionStats,
    }
  } catch (error) {
    console.error(`Error fetching details for course ${courseId}:`, error)
    return { error: 'Failed to fetch course details' }
  }
}

async function getSubmissionStats(
  courseId: string,
  submissions: GoogleAssignment[],
  token: string,
) {
  let turnedIn = 0,
    assigned = 0,
    graded = 0,
    reviewed = 0

  await Promise.allSettled(
    submissions.map(async (assignment) => {
      const submissionsData = await fetchGoogleClassroomAPI<GoogleSubmissionsList>(
        `${API_BASE}/courses/${courseId}/courseWork/${assignment.id}/studentSubmissions`,
        token,
      )

      submissionsData?.studentSubmissions?.forEach((submission) => {
        if (submission.state === 'TURNED_IN') turnedIn++
        if (submission.state === 'CREATED' || submission.state === 'NEW') assigned++
        if (submission.state === 'RETURNED') graded++
        if (submission.state === 'RECLAIMED_BY_STUDENT' || submission.state === 'DRAFT') reviewed++
      })
    }),
  )

  return { turnedIn, assigned, graded, reviewed }
}

export async function GET(req: NextRequest) {
  try {
    const token = await getUserAccessToken(req)
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const coursesResponse = await fetchGoogleClassroomAPI<{ courses?: GoogleCourse[] }>(
      `${API_BASE}/courses`,
      token,
    )

    // If no courses exist, return an empty array instead of failing
    if (!coursesResponse || !coursesResponse.courses || coursesResponse.courses.length === 0) {
      return NextResponse.json({ courses: [] }, { status: 200 }) // Return empty list, not a 500 error
    }

    const courses = coursesResponse.courses
    const courseId = getQueryParam(req, 'courseId')

    if (!courseId) {
      const summaries = await Promise.allSettled(
        courses.map((course) => getCourseSummary(course, token)),
      )
      return NextResponse.json({
        courses: summaries.map((result) => (result.status === 'fulfilled' ? result.value : null)),
      })
    }

    const courseDetails = await getCourseDetails(courseId, token)
    return NextResponse.json(courseDetails)
  } catch (error) {
    console.error('Error retrieving course summary:', error)
    return NextResponse.json({ error: 'Failed to retrieve course summary' }, { status: 500 })
  }
}
