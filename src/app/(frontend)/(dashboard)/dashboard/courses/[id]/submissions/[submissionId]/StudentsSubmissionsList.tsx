'use client'

import { useSubmissions } from '@/hooks/classroom/useSubmissions'

const StudentsSubmissionsList = ({ id }: { id: string; submissionId: string }) => {
  const { data, isLoading } = { data: [], isLoading: true }

  console.log(data, 'data')
  if (isLoading) return <div>Loading...</div>

  return <div>StudentsSubmissionsList</div>
}

export default StudentsSubmissionsList
