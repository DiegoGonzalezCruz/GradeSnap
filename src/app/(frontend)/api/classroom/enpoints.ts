interface EndpointsInterface {
  grades?: {
    endpoint: string
    description: string
  }
  students?: {
    endpoint: string
    description: string
  }
  submissions?: {
    endpoint: string
    description: string
  }
  attachments?: {
    endpoint: string
    description: string
  }
  announcements?: {
    endpoint: string
    description: string
  }
  materials?: {
    endpoint: string
    description: string
  }
}

export const endpoints: EndpointsInterface = {
  grades: {
    endpoint: 'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
    description:
      'View course work and grades for students in the Google Classroom classes you teach or administer',
  },

  submissions: {
    endpoint: 'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly',
    description:
      'View course work and grades for students in the Google Classroom classes you teach or administer',
  },
  attachments: {
    endpoint: 'https://www.googleapis.com/auth/classroom.addons.student',
    description: 'See and update its own attachments to posts in Google Classroom',
  },
  announcements: {
    endpoint: 'https://www.googleapis.com/auth/classroom.announcements',
    description: 'View and manage announcements in Google Classroom',
  },
  materials: {
    endpoint: 'https://www.googleapis.com/auth/classroom.courseworkmaterials',
    description: 'See, edit, and create classwork materials in Google Classroom',
  },
}
