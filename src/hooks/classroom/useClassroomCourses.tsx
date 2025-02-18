import { useQuery } from '@tanstack/react-query'

const fetchClassroomCourses = async () => {
  const res = await fetch('/api/classroom/courses')
  if (!res.ok) {
    throw new Error('Failed to fetch classroom courses')
  }
  const courses = await res.json()
  // console.log(courses, 'COURSES FROM CLIENT')

  return courses
}

export function useClassroomCourses() {
  return useQuery({
    queryKey: ['classroomCourses'],
    queryFn: fetchClassroomCourses,
  })
}
