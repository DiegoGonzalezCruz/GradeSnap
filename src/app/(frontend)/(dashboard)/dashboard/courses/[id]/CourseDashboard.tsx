'use client'
import Breadcrubms from '@/components/Breadcrumbs'
import CourseWorkList from '@/components/Courses/CourseWork/CourseWorkList'
import { useCourseInfo } from '@/hooks/classroom/useCourseInfo'
import React from 'react'

const CourseDashboard = ({ id }: { id: string }) => {
  const { data, isLoading, isError, isSuccess } = useCourseInfo(id)
  // console.log(course, ' course ***** ')
  // console.log(courseWork, ' courseWork ***** ')
  // console.log(submissions, ' submissions ***** ')
  // console.log(rubrics, ' rubrics ***** ')
  if (isError) return <div>Error!</div>
  if (isLoading) {
    return <div>Loading course details...</div>
  }

  if (isSuccess) {
    // console.log(data, 'DATA FROM COURSE')
    return (
      <div className="">
        <Breadcrubms
          breadcrumbArray={[
            { title: 'Home', href: '/' },
            { title: 'Courses', href: '/courses' },
            { title: data?.name, href: `/courses/${id}` },
          ]}
        />

        <CourseWorkList id={id} />
      </div>
    )
  }
}

export default CourseDashboard
