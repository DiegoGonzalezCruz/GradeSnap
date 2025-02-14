import { generateSummary } from '@/utilities/gemini'
import { useQuery } from '@tanstack/react-query'

const fetchClassroomSummary = async () => {
  const res = await fetch('/api/classroom/summary')
  if (!res.ok) {
    throw new Error('Failed to fetch classroom data')
  }
  const summary = await res.json()
  // console.log(summary, 'SUMMARY FROM CLIENT')
  const summaryData = await generateSummary(summary)
  // console.log('summaryData', summaryData)
  return summaryData
}

export function useClassroomSummary() {
  return useQuery({
    queryKey: ['classroomSummary'],
    queryFn: fetchClassroomSummary,
  })
}
