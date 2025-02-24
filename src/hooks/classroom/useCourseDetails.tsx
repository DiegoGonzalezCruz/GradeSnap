'use client'

import { useCourseInfo } from './useCourseInfo'
import { useCourseWork } from './useCourseWork'

import { useRubrics } from './useRubrics'
import { useSubmissions } from './useSubmissions'

export function useCourseDetails(courseId: string) {
  const { data: course } = useCourseInfo(courseId)
  const { data: courseWork } = useCourseWork(courseId)
  const { data: submissions } = useSubmissions(courseId)
  const { data: rubrics } = useRubrics(courseId)

  return {
    course,
    courseWork,
    submissions,
    rubrics,
  }
}
