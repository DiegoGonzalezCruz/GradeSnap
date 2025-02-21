export interface CourseWork {
  courseId: string
  id: string
  title: string
  description: string
  materials: {
    driveFile?: {
      driveFile: {
        id: string
        title: string
        alternateLink: string
        thumbnailUrl: string
      }
      shareMode: string
    }
  }[]
  state: string
  alternateLink: string
  creationTime: string
  updateTime: string
  dueDate: {
    year: number
    month: number
    day: number
  }
  dueTime: {
    hours: number
    minutes: number
  }
  maxPoints: number
  workType: string
}

export interface Assignment {
  courseId: string
  courseWorkId: string
  id: string
  userId: string
  creationTime: string
  updateTime: string
  state: string
  alternateLink: string
  courseWorkType: string
  assignmentSubmission: Record<string, any>
  user: {
    id: string
    name: {
      givenName: string
      familyName: string
      fullName: string
    }
  }
  attachments: any[]
}

export interface Rubric {
  courseId: string
  courseWorkId: string
  id: string
  criteria: {
    id: string
    title: string
    description: string
    levels: {
      id: string
      title: string
      description: string
      points: number
    }[]
  }[]
}
