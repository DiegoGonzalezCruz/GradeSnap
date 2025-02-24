'use client'

import { useQuery } from '@tanstack/react-query'
import { useCourseWork } from './useCourseWork'

export const fetchRubrics = async (courseId: string, courseWorkId: string): Promise<any> => {
  const rubricsRes = await fetch(
    `/api/classroom/rubrics?courseId=${courseId}&courseWorkId=${courseWorkId}`,
  )
  if (!rubricsRes.ok) {
    console.error('Failed to fetch rubrics for course work', courseWorkId)
    return { rubrics: [] }
  }
  const rubrics = await rubricsRes.json()
  return rubrics.rubrics || []
}

export function useRubrics(courseId: string) {
  const { data: courseWork } = useCourseWork(courseId)

  return useQuery({
    queryKey: ['rubrics', courseId],
    queryFn: async () => {
      if (!courseWork) return {}
      const rubricsList = await Promise.all(
        courseWork.map(async (work: any) => {
          return await fetchRubrics(courseId, work.id)
        }),
      )

      const rubricsRecord: Record<string, any> = {}
      courseWork.forEach((work: any, index: number) => {
        if (rubricsList[index] && rubricsList[index].length > 0) {
          rubricsRecord[work.id] = rubricsList[index][0] || {}
        } else {
          rubricsRecord[work.id] = {}
        }
      })
      return rubricsRecord
    },
    enabled: !!courseWork,
  })
}
