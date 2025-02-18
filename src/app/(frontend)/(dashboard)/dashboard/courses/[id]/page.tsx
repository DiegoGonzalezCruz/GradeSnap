'use client'

import { useCourseDetails } from '@/hooks/classroom/useCourseDetails'
import { useParams } from 'next/navigation'

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: courseDetails, isLoading, isError } = useCourseDetails(id as string)
  console.log(courseDetails, 'DATA ****')
  if (isLoading) {
    return <div>Loading course details...</div>
  }

  if (isError) {
    return <div>Error fetching course details.</div>
  }

  if (!courseDetails) {
    return <div>Course not found.</div>
  }

  return (
    <div>
      <h1>{courseDetails.course.name}</h1>
      <p>{courseDetails.course.description}</p>
      <h2>Assignments</h2>
      <ul>
        {courseDetails.assignments.map((assignment: any) => (
          <li key={assignment.id}>{assignment.title}</li>
        ))}
      </ul>
      <h2>Rubrics</h2>
      <ul>
        {courseDetails.rubrics.map((rubric: any) => (
          <li key={rubric.id}>{rubric.name}</li>
        ))}
      </ul>
    </div>
  )
}
