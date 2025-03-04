import Link from 'next/link'
import { FaGraduationCap } from 'react-icons/fa'

import { Card, CardContent } from '../ui/card'
// import Image from 'next/image'
import { Button } from '../ui/button'
import { Course, Deadline } from '@/types/courses'
import Image from 'next/image'

function formatDate(deadline: Deadline | string): string {
  if (typeof deadline === 'string') {
    return deadline
  }
  return new Date(deadline.year, deadline.month - 1, deadline.day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function CourseCards({ courses }: { courses: Course[] }) {
  return (
    <div className="w-full mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Courses</h2>
        {/* <Link href="/courses" className="text-sm text-primary hover:underline">
          View all
        </Link> */}
      </div>
      <div className="space-y-4  w-full">
        {courses.map((course, idx) => (
          <div key={course.courseId} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center gap-6 p-4">
                <div className="">
                  <Image
                    src="/icons/graduation-icon.svg"
                    alt=""
                    width={48}
                    height={48}
                    className="rounded bg-muted p-2"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="min-w-[140px]">
                      <h3 className="font-medium">{course.courseName}</h3>
                      <p className="text-sm text-muted-foreground">ID: {course.courseId}</p>
                    </div>
                    <div className="flex items-center gap-6 text-sm flex-wrap flex-1">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Students</p>
                        <p className="font-medium">{course.studentCount}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">submissions</p>
                        <p className="font-medium">{course.numSubmissions}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Next Deadline</p>
                        <p className="font-medium">{formatDate(course.nextDeadline)}</p>
                      </div>
                    </div>
                    <Link href={`/dashboard/courses/${course.courseId}`}>
                      <Button variant="secondary" className="ml-auto shrink-0">
                        View Course Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        ))}
      </div>
    </div>
  )
}
