'use client'

import { useQuery } from '@tanstack/react-query'

interface CourseDetails {
  course: any
  assignments: any[]
  rubrics: any[]
}

const fetchCourseDetails = async (courseId: string): Promise<CourseDetails> => {
  const res = await fetch(`/api/classroom/courses?courseId=${courseId}`)
  // console.log(res, '*********** RESPONSE **************')
  if (!res.ok) {
    throw new Error('Failed to fetch course details')
  }
  const course = await res.json()
  console.log(course, ' *********** COURSE **************')

  // Fetch course work (assignments)
  const courseWorkRes = await fetch(`/api/classroom/coursework?courseId=${courseId}`)
  if (!courseWorkRes.ok) {
    throw new Error('Failed to fetch course work')
  }
  const { courseWork } = await courseWorkRes.json()
  console.log(courseWork, ' *********** COURSE WORK **************')

  // Fetch submissions for each assignment
  const assignments = await Promise.all(
    courseWork.map(async (work: any) => {
      const assignmentsRes = await fetch(
        `/api/classroom/submissions?courseId=${courseId}&courseWorkId=${work.id}`,
      )
      // console.log(assignmentsRes, ' *********** ASSIGNMENTS RES **************')
      if (!assignmentsRes.ok) {
        console.error('Failed to fetch assignments for course work', work.id)
        return []
      }
      const { studentSubmissions } = await assignmentsRes.json()
      // console.log(assignments, ' *********** ASSIGNMENTS FOR COURSE WORK')
      return studentSubmissions || [] //TODO: Review this [0]
    }),
  )
  //console.log(assignments, ' *********** ASSIGNMENTS **************')

  // Fetch rubrics for each assignment
  const rubrics = await Promise.all(
    courseWork.map(async (work: any) => {
      const rubricsRes = await fetch(
        `/api/classroom/rubrics?courseId=${courseId}&courseWorkId=${work.id}`,
      )
      // console.log(rubricsRes, ' *********** RUBRICS RES **************')
      if (!rubricsRes.ok) {
        console.error('Failed to fetch rubrics for course work', work.id)
        return { rubrics: [] }
      }
      const rubrics = await rubricsRes.json()
      // console.log(rubrics, ' *********** RUBRICS FOR COURSE WORK **************')
      return rubrics.rubrics || []
    }),
  )
  //console.log(rubrics, ' *********** RUBRICS **************')

  return {
    course,
    assignments,
    rubrics,
  }
}

export function useCourseDetails(courseId: string) {
  return useQuery({
    queryKey: ['courseDetails', courseId],
    queryFn: () => fetchCourseDetails(courseId),
  })
}
