import CourseDashboard from './CourseDashboard'

export const metadata = {
  title: 'GradeSnap - Course Detail',
}

export default async function CourseDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id

  return <CourseDashboard id={id} />
}
