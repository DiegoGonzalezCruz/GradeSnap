'use client'

import { useClassroomSummary } from '@/hooks/classroom/useClassroomSummary'

import CourseCardsList from '../Courses/CourseCardsList'
import { Card } from '@/components/ui/card'
import CourseCardLoading from '../Courses/CourseCardLoading'

export function ClassroomData() {
  const { data, error, isLoading, isSuccess } = useClassroomSummary()

  if (isLoading) {
    return <CourseCardLoading />
  }

  if (error) return <div>{error.message}</div>

  if (isSuccess) {
    const { courses } = data
    // console.log(courses, 'courses')

    return (
      <Card className="flex flex-row items-center justify-between gap-20 w-full h-full bg-card">
        <CourseCardsList courses={courses} />
      </Card>
    )
  }
}
