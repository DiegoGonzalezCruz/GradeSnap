import { classroom_v1 } from 'googleapis'

// Single Course Type
export type GCourse = classroom_v1.Schema$Course

// List of Students
export type GListStudentsResponse = classroom_v1.Schema$ListStudentsResponse
export type GStudent = classroom_v1.Schema$Student

// List of CourseWork
export type GListCourseWorkResponse = classroom_v1.Schema$ListCourseWorkResponse
export type GAssignment = classroom_v1.Schema$CourseWork

// List of Student Submissions
export type GListStudentSubmissionsResponse = classroom_v1.Schema$ListStudentSubmissionsResponse
export type GStudentSubmission = classroom_v1.Schema$StudentSubmission

// Custom type for Assignment with possible null values for dueDate
export type GAssignmentWithDeadline = GAssignment & {
  dueDate?: { year: number; month: number; day: number } | null
}
