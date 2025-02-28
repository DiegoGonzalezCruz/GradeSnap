'use client'

import { useQuery } from '@tanstack/react-query'

export const fetchCourseWork = async (courseId: string): Promise<any[]> => {
  const courseWorkRes = await fetch(`/api/classroom/coursework?courseId=${courseId}`)
  // console.log(courseWorkRes, 'Course Work Res')
  if (!courseWorkRes.ok) {
    throw new Error('Failed to fetch course work')
  }
  const { courseWork } = await courseWorkRes.json()
  return courseWork
}

export function useCourseWork(courseId: string) {
  return useQuery({
    queryKey: ['courseWork', courseId],
    queryFn: () => fetchCourseWork(courseId),
  })
}
