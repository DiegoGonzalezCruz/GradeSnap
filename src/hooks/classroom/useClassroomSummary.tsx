import { generateSummary } from '@/utilities/gemini'
import { useQuery } from '@tanstack/react-query'

const fetchClassroomSummary = async () => {
  const res = await fetch('/api/classroom/summary')
  if (!res.ok) {
    throw new Error('Failed to fetch classroom data')
  }
  const summary = await res.json()
  // console.log(summary, 'SUMMARY FROM CLIENT')

  // console.log('summaryData', summaryData)
  return summary
}

const createSummary = async () => {
  const summary = await fetchClassroomSummary()
  console.log(summary, 'SUMMARY FROM CLIENT')
  const summaryData = await generateSummary(summary)
  console.log(summaryData, 'SUMMARY FROM CLIENT')
  return summaryData
}

export function useClassroomSummary() {
  return useQuery({
    queryKey: ['classroomSummary'],
    queryFn: createSummary,
  })
}

export function useClassroomStats() {
  return useQuery({
    queryKey: ['classroomStats'],
    queryFn: fetchClassroomSummary,
  })
}
