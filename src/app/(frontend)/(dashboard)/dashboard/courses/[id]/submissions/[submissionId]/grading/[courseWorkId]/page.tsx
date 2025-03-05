import React from 'react'
import GradingInterface from './GradingInterface'
import { Metadata } from 'next'
import Breadcrubms from '@/components/Breadcrumbs'

export type GradingArgs = {
  params: Promise<{
    id?: string
    submissionId?: string
    gradingId?: string
  }>
}

const GradingSubmissionPage = async ({ params }: GradingArgs) => {
  const { id, submissionId, gradingId } = await params

  console.log(id, submissionId, gradingId)
  console.log('****** FROM GRADING SUBMISSION PAGE ******')

  const breadcrumbArray = [
    {
      title: 'Home',
      href: '/dashboard',
    },
    {
      title: 'Courses',
      href: '/dashboard/courses',
    },
    {
      title: 'Course Details',
      href: `/dashboard/courses/${id}`,
    },
    {
      title: 'Students Submissions',
      href: `/dashboard/courses/${id}/submissions/${submissionId}`,
    },
    {
      title: 'Grading Interface',
      href: `/dashboard/courses/${id}/submissions/${submissionId}/grading`,
    },
  ]

  return (
    <div className="flex flex-col gap-10">
      <Breadcrubms breadcrumbArray={breadcrumbArray} />
      <GradingInterface id={id!} submissionId={submissionId!} />
    </div>
  )
}

export default GradingSubmissionPage
