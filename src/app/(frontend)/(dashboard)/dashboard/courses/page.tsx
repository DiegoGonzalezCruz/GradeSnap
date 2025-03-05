import CoursesList from './CoursesList'

interface Course {
  id: string
  name: string
  description?: string
  section?: string
}

export default function CoursesDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      <CoursesList />
    </div>
  )
}
