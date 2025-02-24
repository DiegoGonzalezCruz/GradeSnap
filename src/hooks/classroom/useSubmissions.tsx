'use client'

import { useQuery } from '@tanstack/react-query'
import { useCourseWork } from './useCourseWork'

export const fetchSubmissions = async (courseId: string, courseWorkId: string): Promise<any[]> => {
  const submissionsRes = await fetch(
    `/api/classroom/submissions?courseId=${courseId}&courseWorkId=${courseWorkId}`,
  )
  if (!submissionsRes.ok) {
    console.error('Failed to fetch submissions for course work', courseWorkId)
    return []
  }
  const { studentSubmissions } = await submissionsRes.json()
  return studentSubmissions || []
}

export function useSubmissions(courseId: string) {
  const { data: courseWork } = useCourseWork(courseId)

  return useQuery({
    queryKey: ['submissions', courseId, courseWork],
    queryFn: async () => {
      if (!courseWork) return {}
      const submissionsList = await Promise.all(
        courseWork.map(async (work: any) => {
          return await fetchSubmissions(courseId, work.id)
        }),
      )

      const submissionsRecord: Record<string, any[]> = {}
      courseWork.forEach((work: any, index: number) => {
        submissionsRecord[work.id] = submissionsList[index] || []
      })
      return submissionsRecord
    },
    enabled: !!courseWork,
  })
}
