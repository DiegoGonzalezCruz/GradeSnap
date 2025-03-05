import { GAssignmentWithDeadline, GCourse } from '@/types/courses'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

function formatDate(deadline: any | string): string {
  // console.log('HELLO')
  if (typeof deadline === 'string') {
    return deadline
  }
  return new Date(deadline.year, deadline.month - 1, deadline.day).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const CourseTab = ({ course }: { course: any }) => {
  console.log(course, 'COURSE')
  return (
    <div className=" ">
      <div className="flex items-center justify-between gap-6  ">
        <div className="">
          <Image
            src="/icons/graduation-icon.svg"
            alt=""
            width={48}
            height={48}
            className="rounded bg-muted p-2"
          />
        </div>
        <div className="flex-1 min-w-0 ">
          <div className="flex flex-row  items-center gap-5 ">
            <div className="w-1/4">
              <h3 className="font-bold text-lg">{course.courseName}</h3>
              <p className="text-sm text-muted-foreground">ID: {course.courseId}</p>
            </div>
            <div className="flex items-center gap-6 text-sm  flex-1 ">
              <div className="space-y-1">
                <p className="text-muted-foreground">Students</p>
                <p className="font-bold text-2xl">{course.studentCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Submissions</p>
                <p className="font-bold text-2xl">{course.numSubmissions}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Next Deadline</p>
                <p className="font-bold text-2xl">{formatDate(course.nextDeadline)}</p>
              </div>
            </div>
            <Link href={`/dashboard/courses/${course.courseId}`}>
              <Button className="ml-auto shrink-0">View Course Details</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseTab
