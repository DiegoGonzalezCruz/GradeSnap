'use client'

import { useQuery } from '@tanstack/react-query'

export const fetchCourseInfo = async (courseId: string): Promise<any> => {
  const res = await fetch(`/api/classroom/courses?courseId=${courseId}`)
  if (!res.ok) {
    throw new Error('Failed to fetch course details')
  }
  const course = await res.json()
  return course
}

export function useCourseInfo(courseId: string) {
  return useQuery({
    queryKey: ['courseInfo', courseId],
    queryFn: () => fetchCourseInfo(courseId),
  })
}
