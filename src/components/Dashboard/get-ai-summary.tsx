'use client'
import { useClassroomSummary } from '@/hooks/classroom/useClassroomSummary'

const GetAISummary = () => {
  const { data, error, isLoading } = useClassroomSummary()
  console.log(data, 'DATA')

  return <div>{data}</div>
}

export default GetAISummary
