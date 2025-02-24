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
  submissionsubmission: Record<string, any>
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

interface Level {
  id: string
  title: string
  description?: string
  points: number
}

interface Criterion {
  id: string
  title: string
  description?: string
  levels: Level[]
}

export interface Rubric {
  courseId: string
  courseWorkId: string
  creationTime: string
  updateTime: string
  id: string
  criteria: Criterion[]
}

// The overall data structure is an object with keys mapping to Rubric objects.
export interface Rubrics {
  [key: string]: Rubric
}
