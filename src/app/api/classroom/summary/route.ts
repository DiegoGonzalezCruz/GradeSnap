import { getQueryParam } from '@/utilities/classroom'
import { NextRequest, NextResponse } from 'next/server'
import { classroom_v1 } from 'googleapis'
import { getUserAccessToken } from '../../auth/google/getUserAccessToken'
import {
  GAssignment,
  GCourse,
  GListCourseWorkResponse,
  GListStudentsResponse,
  GListStudentSubmissionsResponse,
} from '@/types/courses'

const API_BASE = 'https://classroom.googleapis.com/v1'

// Generic function to fetch from Google Classroom API
async function fetchGoogleClassroomAPI<T>(url: string, token: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${await res.text()}`)
    return (await res.json()) as T
  } catch (error) {
    console.error(`Error fetching ${url}:`, error)
    return null
  }
}

// Type guard to ensure an assignment has a valid dueDate
function hasValidDueDate(
  s: GAssignment,
): s is GAssignment & { dueDate: { year: number; month: number; day: number } } {
  return (
    !!s.dueDate &&
    typeof s.dueDate.year === 'number' &&
    typeof s.dueDate.month === 'number' &&
    typeof s.dueDate.day === 'number'
  )
}

function getNextDeadline(
  submissions: GAssignment[],
): { year: number; month: number; day: number } | string {
  const validSubmissions = submissions
    .filter(hasValidDueDate) // Now TS knows dueDate is defined.
    .map((s) => {
      const { year, month, day } = s.dueDate // Safe to access.
      return {
        date: new Date(`${year}-${month}-${day}`),
        dueDate: { year, month, day },
      }
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  if (validSubmissions.length > 0 && validSubmissions[0]?.dueDate) {
    return validSubmissions[0].dueDate
  } else {
    return 'No upcoming deadlines'
  }
}

// Fetch course summary with student count and upcoming deadlines
async function getCourseSummary(course: GCourse, token: string) {
  try {
    const [studentsData, courseWorkData] = await Promise.allSettled([
      fetchGoogleClassroomAPI<GListStudentsResponse>(
        `${API_BASE}/courses/${course.id}/students`,
        token,
      ),
      fetchGoogleClassroomAPI<GListCourseWorkResponse>(
        `${API_BASE}/courses/${course.id}/courseWork`,
        token,
      ),
    ])

    const studentCount =
      (studentsData.status === 'fulfilled' && studentsData.value?.students?.length) || 0
    const submissions =
      (courseWorkData.status === 'fulfilled' && courseWorkData.value?.courseWork) || []

    return {
      courseId: course.id,
      courseName: course.name,
      studentCount,
      numSubmissions: submissions.length,
      nextDeadline: getNextDeadline(submissions),
      studentData: studentsData,
      courseWorkData: courseWorkData,
    }
  } catch (error) {
    console.error(`Error fetching data for course ${course.id}:`, error)
    return { courseId: course.id, error: 'Failed to fetch data' }
  }
}

// Fetches submission stats (turned in, assigned, graded, reviewed)
async function getSubmissionStats(courseId: string, submissions: GAssignment[], token: string) {
  let turnedIn = 0,
    assigned = 0,
    graded = 0,
    reviewed = 0

  await Promise.allSettled(
    submissions.map(async (assignment) => {
      const submissionsData = await fetchGoogleClassroomAPI<GListStudentSubmissionsResponse>(
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

// Fetch full course details
async function getCourseDetails(courseId: string, token: string) {
  try {
    const [courseData, studentsData, courseWorkData] = await Promise.allSettled([
      fetchGoogleClassroomAPI<GCourse>(`${API_BASE}/courses/${courseId}`, token),
      fetchGoogleClassroomAPI<GListStudentsResponse>(
        `${API_BASE}/courses/${courseId}/students`,
        token,
      ),
      fetchGoogleClassroomAPI<GListCourseWorkResponse>(
        `${API_BASE}/courses/${courseId}/courseWork`,
        token,
      ),
    ])

    const studentCount =
      (studentsData.status === 'fulfilled' && studentsData.value?.students?.length) || 0
    const submissions =
      (courseWorkData.status === 'fulfilled' && courseWorkData.value?.courseWork) || []
    const submissionStats = await getSubmissionStats(courseId, submissions, token)

    return {
      courseName:
        courseData.status === 'fulfilled' && courseData.value ? courseData.value.name : 'Unknown',
      studentCount,
      numSubmissions: submissions.length,
      nextDeadline: getNextDeadline(submissions),
      ...submissionStats,
    }
  } catch (error) {
    console.error(`Error fetching details for course ${courseId}:`, error)
    return { error: 'Failed to fetch course details' }
  }
}

// API Route Handler
export async function GET(req: NextRequest) {
  try {
    const token = await getUserAccessToken(req)
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const coursesResponse = await fetchGoogleClassroomAPI<{ courses?: GCourse[] }>(
      `${API_BASE}/courses`,
      token,
    )

    if (!coursesResponse?.courses?.length) {
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

    return NextResponse.json(await getCourseDetails(courseId, token))
  } catch (error) {
    console.error('Error retrieving course summary:', error)
    return NextResponse.json({ error: 'Failed to retrieve course summary' }, { status: 500 })
  }
}
