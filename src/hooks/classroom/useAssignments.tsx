'use client'

import { useQuery } from '@tanstack/react-query'
import { useCourseWork } from './useCourseWork'

export const fetchAssignments = async (courseId: string, courseWorkId: string): Promise<any[]> => {
  const assignmentsRes = await fetch(
    `/api/classroom/submissions?courseId=${courseId}&courseWorkId=${courseWorkId}`,
  )
  if (!assignmentsRes.ok) {
    console.error('Failed to fetch assignments for course work', courseWorkId)
    return []
  }
  const { studentSubmissions } = await assignmentsRes.json()
  return studentSubmissions || []
}

export function useAssignments(courseId: string) {
  const { data: courseWork } = useCourseWork(courseId)

  return useQuery({
    queryKey: ['assignments', courseId, courseWork],
    queryFn: async () => {
      if (!courseWork) return {}
      const assignmentsList = await Promise.all(
        courseWork.map(async (work: any) => {
          return await fetchAssignments(courseId, work.id)
        }),
      )

      const assignmentsRecord: Record<string, any[]> = {}
      courseWork.forEach((work: any, index: number) => {
        assignmentsRecord[work.id] = assignmentsList[index] || []
      })
      return assignmentsRecord
    },
    enabled: !!courseWork,
  })
}
