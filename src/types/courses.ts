export interface Deadline {
  year: number
  month: number
  day: number
}

export interface Course {
  courseId: string
  courseName: string
  studentCount: number
  numSubmissions: number
  nextDeadline: Deadline | string
}
