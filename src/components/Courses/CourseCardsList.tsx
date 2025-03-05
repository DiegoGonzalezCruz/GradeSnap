'use client'

import Link from 'next/link'
import { GCourse } from '@/types/courses'
import { Separator } from '../ui/separator'
import CourseTab from './CourseTab'
import { Card } from '../ui/card'

export default function CourseCardsList({
  courses,
  preview = false,
}: {
  courses: GCourse[]
  preview?: boolean
}) {
  // Decide how many courses to display
  const displayedCourses = preview ? courses.slice(0, 3) : courses
  console.log(displayedCourses, 'displayedCourses')

  if (displayedCourses.length === 0) {
    return <div className="p-5">No courses found in your account.</div>
  }

  return (
    <div className="w-full mx-auto p-5 gap-5 flex flex-col">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-xl font-semibold">Your Courses</h2>
        {preview && (
          <Link href="/dashboard/courses" className="text-sm text-primary hover:underline">
            View all
          </Link>
        )}
      </div>

      <div className="w-full flex flex-col gap-5">
        {displayedCourses.map((course, idx) => (
          <div key={course.id} className="flex flex-col w-full gap-5">
            <CourseTab course={course} />
            {/* Only show Separator if it's not the last item displayed */}
            {idx < displayedCourses.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  )
}
