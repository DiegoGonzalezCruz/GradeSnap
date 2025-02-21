import { getQueryParam, getTokenFromCookies } from '@/utilities/classroom'
import { NextRequest, NextResponse } from 'next/server'

const API_BASE = 'https://classroom.googleapis.com/v1'

// Define Types for Responses
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

interface GoogleAssignmentsList {
  courseWork?: GoogleAssignment[]
}

interface GoogleSubmission {
  state: 'TURNED_IN' | 'CREATED' | 'NEW' | 'RETURNED' | 'RECLAIMED_BY_STUDENT' | 'DRAFT'
}

interface GoogleSubmissionsList {
  studentSubmissions?: GoogleSubmission[]
}

// Function to fetch Google Classroom API with type safety
async function fetchGoogleClassroomAPI(url: string, token: string): Promise<any> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    console.error(`Error fetching ${url}:`, await res.text())
    throw new Error(`Failed to fetch: ${url}`)
  }

  return res.json()
}

// Function to get course summary
async function getCourseSummary(course: GoogleCourse, token: string) {
  try {
    const studentsData: GoogleStudentList = await fetchGoogleClassroomAPI(
      `${API_BASE}/courses/${course.id}/students`,
      token,
    )
    const studentCount = studentsData.students?.length || 0

    const assignmentsData: GoogleAssignmentsList = await fetchGoogleClassroomAPI(
      `${API_BASE}/courses/${course.id}/courseWork`,
      token,
    )
    const assignments = assignmentsData.courseWork || []
    const numAssignments = assignments.length

    const nextDeadline = getNextDeadline(assignments)

    return {
      courseId: course.id,
      courseName: course.name,
      studentCount,
      numAssignments,
      nextDeadline,
    }
  } catch (error) {
    console.error(`Error fetching data for course ${course.id}:`, error)
    return { courseId: course.id, error: 'Failed to fetch data' }
  }
}

// Function to get next deadline
function getNextDeadline(assignments: GoogleAssignment[]) {
  const sortedAssignments = assignments
    .filter((a) => a.dueDate)
    .sort((a, b) => {
      const dateA = new Date(`${a.dueDate!.year}-${a.dueDate!.month}-${a.dueDate!.day}`).getTime()
      const dateB = new Date(`${b.dueDate!.year}-${b.dueDate!.month}-${b.dueDate!.day}`).getTime()
      return dateA - dateB
    })

  return sortedAssignments.length ? sortedAssignments?.[0]?.dueDate : 'No upcoming deadlines'
}

// Function to get detailed course data
async function getCourseDetails(courseId: string, token: string) {
  const courseData: GoogleCourse = await fetchGoogleClassroomAPI(
    `${API_BASE}/courses/${courseId}`,
    token,
  )
  const studentsData: GoogleStudentList = await fetchGoogleClassroomAPI(
    `${API_BASE}/courses/${courseId}/students`,
    token,
  )
  const assignmentsData: GoogleAssignmentsList = await fetchGoogleClassroomAPI(
    `${API_BASE}/courses/${courseId}/courseWork`,
    token,
  )

  const studentCount = studentsData.students?.length || 0
  const assignments = assignmentsData.courseWork || []
  const numAssignments = assignments.length
  const nextDeadline = getNextDeadline(assignments)

  const submissionStats = await getSubmissionStats(courseId, assignments, token)

  return {
    courseName: courseData.name,
    studentCount,
    numAssignments,
    nextDeadline,
    ...submissionStats,
  }
}

// Function to get submission stats
async function getSubmissionStats(
  courseId: string,
  assignments: GoogleAssignment[],
  token: string,
) {
  let turnedIn = 0,
    assigned = 0,
    graded = 0,
    reviewed = 0

  await Promise.all(
    assignments.map(async (assignment) => {
      const submissionsData: GoogleSubmissionsList = await fetchGoogleClassroomAPI(
        `${API_BASE}/courses/${courseId}/courseWork/${assignment.id}/studentSubmissions`,
        token,
      )

      submissionsData.studentSubmissions?.forEach((submission) => {
        if (submission.state === 'TURNED_IN') turnedIn++
        if (submission.state === 'CREATED' || submission.state === 'NEW') assigned++
        if (submission.state === 'RETURNED') graded++
        if (submission.state === 'RECLAIMED_BY_STUDENT' || submission.state === 'DRAFT') reviewed++
      })
    }),
  )

  return { turnedIn, assigned, graded, reviewed }
}

// GET API Route
export async function GET(req: NextRequest) {
  console.log('GET request received')

  try {
    const token = await getTokenFromCookies(req)
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    console.log('before fetching courses')
    const coursesResponse: { courses: GoogleCourse[] } = await fetchGoogleClassroomAPI(
      `${API_BASE}/courses`,
      token,
    )
    const { courses } = coursesResponse
    console.log(courses, 'courses response****')

    const courseId = getQueryParam(req, 'courseId')

    if (!courseId) {
      const summaries = await Promise.all(courses.map((course) => getCourseSummary(course, token)))
      return NextResponse.json({ courses: summaries })
    }

    const courseDetails = await getCourseDetails(courseId, token)
    return NextResponse.json(courseDetails)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error retrieving course summary:', errorMessage)
    return NextResponse.json(
      { error: 'Failed to retrieve course summary', details: errorMessage },
      { status: 500 },
    )
  }
}
