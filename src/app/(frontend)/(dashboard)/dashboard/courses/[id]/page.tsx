'use client'

import { useCourseDetails } from '@/hooks/classroom/useCourseDetails'
import { useParams } from 'next/navigation'
import CourseWorkDetails from '@/components/Courses/CourseWork/CourseWorkDetails'

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const { course, courseWork, submissions, rubrics } = useCourseDetails(id as string)
  console.log(course, ' course ***** ')
  console.log(courseWork, ' courseWork ***** ')
  console.log(submissions, ' submissions ***** ')
  console.log(rubrics, ' rubrics ***** ')
  if (!course || !courseWork || !submissions || !rubrics) {
    return <div>Loading course details...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-black">{course?.name}</h1>
      <p>{course?.description}</p>
      <p>Room: {course?.room}</p>
      <p>Section: {course?.section}</p>
      <p>Last Updated: {course?.updateTime}</p>

      <CourseWorkDetails courseWorks={courseWork} submissions={submissions} rubrics={rubrics} />
    </div>
  )
}
