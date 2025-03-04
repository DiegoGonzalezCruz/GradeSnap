import Link from 'next/link'

// import Image from 'next/image'
import { Button } from '../ui/button'
import { Course, Deadline } from '@/types/courses'
import Image from 'next/image'
import { Separator } from '../ui/separator'
import CourseCard from './CourseCard'

export default function CourseCardsList({ courses }: { courses: Course[] }) {
  return (
    <div className="w-full mx-auto p-5 gap-5 flex flex-col ">
      <div className="flex justify-between items-center  w-full">
        <h2 className="text-xl font-semibold">Your Courses</h2>
        <Link href="/dashboard/courses" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="  w-full flex flex-col gap-5">
        {courses
          .filter((course, idx) => idx < 3)
          .map((course, idx) => (
            <div key={course.courseId} className="flex flex-col w-full gap-5">
              <CourseCard key={course.courseId} course={course} />
              {idx < 3 && <Separator />}
            </div>
          ))}
      </div>
    </div>
  )
}
