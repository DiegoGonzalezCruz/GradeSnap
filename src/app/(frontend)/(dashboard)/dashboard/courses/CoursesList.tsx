'use client'
import CourseCardsList from '@/components/Courses/CourseCardsList'
import { useClassroomSummary } from '@/hooks/classroom/useClassroomSummary'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, BookOpen } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const CoursesList = () => {
  const { data, error, isLoading, isSuccess, isError } = useClassroomSummary()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        {[...Array(6)].map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to fetch courses. Please try again later. {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  if (!data.courses || data.courses.length === 0) {
    return (
      <Alert>
        <BookOpen className="h-4 w-4" />
        <AlertTitle>No Courses</AlertTitle>
        <AlertDescription>You are not enrolled in any courses at the moment.</AlertDescription>
      </Alert>
    )
  }
  // console.log(data.courses, 'courses')
  if (isSuccess) {
    const { courses } = data

    return (
      <div className="">
        <CourseCardsList courses={courses} />
      </div>
    )
  }
}

export default CoursesList
