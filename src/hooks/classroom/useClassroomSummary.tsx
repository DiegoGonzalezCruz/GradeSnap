import { generateSummary } from '@/utilities/gemini'
import { useQuery, useQueryClient } from '@tanstack/react-query'

// Fetch Classroom Summary (API Call)
const fetchClassroomSummary = async () => {
  const res = await fetch('/api/classroom/summary')
  const response = await res.json()

  if (!res.ok) {
    throw new Error(response.error)
  }

  return response
}

export function useClassroomAISummary() {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['classroomSummary'],
    queryFn: async () => {
      // Get cached classroom summary data
      const summary = queryClient.getQueryData(['classroomStats'])

      // If there's no cached data, fetch it
      if (!summary) {
        const freshSummary = await fetchClassroomSummary()
        queryClient.setQueryData(['classroomStats'], freshSummary)
        return generateSummary(freshSummary)
      }

      // If cached, use it
      return generateSummary(summary)
    },
    enabled: !!queryClient.getQueryData(['classroomStats']), // Only runs if data exists
  })
}

export function useClassroomSummary() {
  return useQuery({
    queryKey: ['classroomStats'],
    queryFn: fetchClassroomSummary,
  })
}
