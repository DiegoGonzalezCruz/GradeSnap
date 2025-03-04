'use client'

import Link from 'next/link'
import { Course } from '@/types/courses'
import { Separator } from '../ui/separator'
import CourseCard from './CourseCard'

export default function CourseCardsList({
  courses,
  preview = false,
}: {
  courses: Course[]
  preview?: boolean
}) {
  // Decide how many courses to display
  const displayedCourses = preview ? courses.slice(0, 3) : courses

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
          <div key={course.courseId} className="flex flex-col w-full gap-5">
            <CourseCard course={course} />
            {/* Only show Separator if it's not the last item displayed */}
            {idx < displayedCourses.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  )
}
