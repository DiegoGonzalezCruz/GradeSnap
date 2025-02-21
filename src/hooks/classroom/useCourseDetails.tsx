'use client'

import { useCourseInfo } from './useCourseInfo'
import { useCourseWork } from './useCourseWork'
import { useAssignments } from './useAssignments'
import { useRubrics } from './useRubrics'

export function useCourseDetails(courseId: string) {
  const { data: course } = useCourseInfo(courseId)
  const { data: courseWork } = useCourseWork(courseId)
  const { data: assignments } = useAssignments(courseId)
  const { data: rubrics } = useRubrics(courseId)

  return {
    course,
    courseWork,
    assignments,
    rubrics,
  }
}
