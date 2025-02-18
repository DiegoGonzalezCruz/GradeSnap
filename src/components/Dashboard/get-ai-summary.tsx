'use client'
import { useClassroomSummary } from '@/hooks/classroom/useClassroomSummary'
import { Skeleton } from '../ui/skeleton'

const GetAISummary = () => {
  const { data, isSuccess, isLoading, error } = useClassroomSummary()
  console.log(data, 'data')
  if (isLoading)
    return (
      <div className="flex items-center space-x-4 w-full">
        <div className="space-y-2 w-full">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )

  if (error) return <div>{error.message}</div>
  if (isSuccess) return <div>{data}</div>
}

export default GetAISummary
