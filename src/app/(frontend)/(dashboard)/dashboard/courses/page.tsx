import CoursesList from './CoursesList'

export const metadata = {
  title: 'GradeSnap - Courses Page',
  description: 'This is the courses page.',
}
export default function CoursesDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      <CoursesList />
    </div>
  )
}
