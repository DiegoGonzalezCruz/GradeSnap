import Link from 'next/link'
import { FaGraduationCap } from 'react-icons/fa'

import { Card, CardContent } from '../ui/card'
// import Image from 'next/image'
import { Button } from '../ui/button'
import { Course, Deadline } from '@/types/courses'
import Image from 'next/image'
import { Separator } from '../ui/separator'

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
    <div className="w-full mx-auto p-5 gap-5 flex flex-col ">
      <div className="flex justify-between items-center  w-full">
        <h2 className="text-xl font-semibold">Your Courses</h2>
        <Link href="/courses" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="  w-full flex flex-col gap-5">
        {courses.map((course, idx) => (
          <div key={course.courseId} className="flex flex-col w-full gap-5">
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
            {idx < courses.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  )
}
