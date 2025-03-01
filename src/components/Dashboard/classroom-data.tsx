'use client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useClassroomSummary } from '@/hooks/classroom/useClassroomSummary'
import { Skeleton } from '../ui/skeleton'
import CourseCards from '../Courses/CourseCard'

export function ClassroomData() {
  const { data, error, isLoading, isSuccess } = useClassroomSummary()

  if (isLoading) {
    return (
      <div className="flex flex-row items-center justify-between gap-20 w-full h-full ">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="flex flex-col w-1/3">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) return <div>{error.message}</div>

  if (isSuccess) {
    const { courses } = data
    // console.log(courses, 'courses')

    return (
      <div className="flex flex-row items-center justify-between gap-20 w-full h-full ">
        <CourseCards courses={courses} />
      </div>
    )
  }
}
