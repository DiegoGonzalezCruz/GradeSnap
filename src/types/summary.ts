export interface CourseData {
  courseId: string
  courseName: string
  studentCount: number
  numSubmissions: number
  nextDeadline: Deadline
  studentData: {
    status: string
    value: {
      students: Student[]
    }
  }
  courseWorkData: {
    status: string
    value: {
      courseWork: CourseWork[]
    }
  }
}

export interface Deadline {
  year: number
  month: number
  day: number
}

export interface Student {
  courseId: string
  userId: string
  profile: {
    id: string
    name: {
      givenName: string
      familyName: string
      fullName: string
    }
  }
}

export interface CourseWork {
  courseId: string
  id: string
  title: string
  description?: string
  materials?: Material[]
  state: string
  alternateLink: string
  creationTime: string
  updateTime: string
  dueDate?: Deadline
  dueTime?: {
    hours: number
    minutes: number
  }
  maxPoints: number
  workType: string
  submissionModificationMode: string
  assignment?: {
    studentWorkFolder: {
      id: string
      title?: string
      alternateLink?: string
    }
  }
  assigneeMode: string
  creatorUserId: string
  topicId?: string
  individualStudentsOptions?: {
    studentIds: string[]
  }
}

export type Material =
  | {
      driveFile: {
        driveFile: {
          id: string
          title: string
          alternateLink: string
          thumbnailUrl: string
        }
        shareMode: string
      }
    }
  | {
      youtubeVideo: {
        id: string
        title: string
        alternateLink: string
        thumbnailUrl: string
      }
    }
  | {
      form: {
        formUrl: string
        title: string
        thumbnailUrl: string
      }
    }
