// useSingleSubmission.ts
'use client'

export async function fetchSingleSubmission(
  courseId: string,
  courseWorkId: string,
  submissionId: string,
): Promise<any> {
  console.log(courseId, 'courseId')
  console.log(courseWorkId, 'courseWorkId')
  console.log(submissionId, 'submissionId')
  const res = await fetch(
    `/api/classroom/submissions/single?courseId=${courseId}&courseWorkId=${courseWorkId}&submissionId=${submissionId}`,
  )

  if (!res.ok) {
    console.error('Failed to fetch single submission', submissionId)
    return null
  }

  const { submission } = await res.json()
  return submission
}

import { useQuery } from '@tanstack/react-query'

export function useGetSubmissionById(courseId: string, courseWorkId: string, submissionId: string) {
  console.log('function called with params:' + courseId + ', ' + courseWorkId + ', ' + submissionId)
  return useQuery({
    queryKey: ['singleSubmission', courseId, courseWorkId, submissionId],
    queryFn: async () => {
      return fetchSingleSubmission(courseId, courseWorkId, submissionId)
    },
    // Only fetch if all IDs are present
    enabled: Boolean(courseId && courseWorkId && submissionId),
  })
}
