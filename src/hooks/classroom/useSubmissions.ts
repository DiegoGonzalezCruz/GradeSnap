import { useState, useMemo } from 'react'

interface Submission {
  id: string
  courseWorkId: string
  state: string
  user: {
    name: {
      fullName: string
    }
  }
  assignedGrade?: number
  updateTime: string
  alternateLink: string
  submissionsubmission?: {
    attachments: any[]
  }
}

interface CourseWork {
  id: string
  title: string
  maxPoints?: number
}

interface UseSubmissionsProps {
  submissions: Record<string, any[]>
  courseWorks: CourseWork[]
  status: string
  searchQuery: string
}

export const useSubmissions = ({
  submissions,
  courseWorks,
  status,

  searchQuery,
}: UseSubmissionsProps) => {
  const allSubmissions = useMemo(() => {
    return Object.values(submissions)
      .flat()
      .filter((assignment: any) => {
        if (status === 'all') return true
        if (status === 'turned-in' && assignment.state === 'TURNED_IN') return true
        if (status === 'returned' && assignment.state === 'RETURNED') return true
        if (
          status === 'created' &&
          assignment.state !== 'TURNED_IN' &&
          assignment.state !== 'RETURNED'
        )
          return true
        return false
      })
      .filter((assignment: any) => {
        const courseWork = courseWorks.find((cw) => cw.id === assignment.courseWorkId)
        if (!courseWork) return false
        return courseWork.title.toLowerCase().includes(searchQuery.toLowerCase())
      })
  }, [submissions, courseWorks, status, searchQuery])

  return allSubmissions
}
