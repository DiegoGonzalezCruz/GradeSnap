'use client'

import { useCourseDetails } from '@/hooks/classroom/useCourseDetails'
import { useParams } from 'next/navigation'
import { AssignmentUser } from '@/components/Dashboard/AssignmentUser'
import { CreateCriterionDialog } from '@/components/Dashboard/CreateCriterionDialog'
import { EditCriterionDialog } from '@/components/Dashboard/EditCriterionDialog'
import CourseWorkDetails from '@/components/Courses/CourseWork/CourseWorkDetails'

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const { course, courseWork, assignments, rubrics } = useCourseDetails(id as string)

  if (!course || !courseWork || !assignments || !rubrics) {
    return <div>Loading course details...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-black">{course?.name}</h1>
      <p>{course?.description}</p>
      <p>Room: {course?.room}</p>
      <p>Section: {course?.section}</p>
      <p>Last Updated: {course?.updateTime}</p>

      <CourseWorkDetails courseWorks={courseWork} assignments={assignments} rubrics={rubrics} />
    </div>
  )
}
