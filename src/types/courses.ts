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

// Rubric type definitions
export interface RubricLevel {
  id: string
  title: string
  description: string
  points: number
}

export interface RubricCriterion {
  id: string
  title: string
  description: string
  levels: RubricLevel[]
}

export interface Rubric {
  courseId: string
  courseWorkId: string
  id: string
  criteria: RubricCriterion[]
}

export interface Attachment {
  driveFile: {
    id: string
    title: string
    alternateLink: string
    thumbnailUrl?: string
  }
}

export interface SubmissionHistory {
  stateHistory: {
    state: string
    stateTimestamp: string
    actorUserId: string
  }
}

export interface Submission {
  courseId: string
  courseWorkId: string
  id: string
  userId: string
  creationTime: string
  updateTime: string
  state: string
  alternateLink: string
  courseWorkType: string
  assignmentSubmission: {
    attachments: Attachment[]
  }
  submissionHistory: SubmissionHistory[]
  user: {
    id: string
    name: {
      givenName: string
      familyName: string
      fullName: string
    }
  }
  attachments: Attachment[]
}

export interface GradingInterfaceProps {
  courseId?: string
  courseWorkId?: string
  submissionId?: string
  attachments?: Attachment[]
  initialRubric?: Rubric
  submission?: Submission
}
