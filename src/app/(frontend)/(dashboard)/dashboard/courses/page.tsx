'use client'

import { useClassroomCourses } from '@/hooks/classroom/useClassroomCourses'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, BookOpen } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Course {
  id: string
  name: string
  description?: string
  section?: string
}

export default function Courses() {
  const { data, isLoading, isError, error } = useClassroomCourses()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.courses &&
          data.courses.map((course: Course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
                {course.section && <CardDescription>Section: {course.section}</CardDescription>}
              </CardHeader>
              <CardContent>
                {course.description ? (
                  <div className="flex flex-col gap-5">
                    <p>{course.description}</p>
                    <Link href={`/dashboard/courses/${course.id}`}>
                      <Button variant={'secondary'}>View Details</Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No description available</p>
                )}
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  )
}
