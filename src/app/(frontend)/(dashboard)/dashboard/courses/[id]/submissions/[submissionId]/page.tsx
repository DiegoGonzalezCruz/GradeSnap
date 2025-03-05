import Breadcrubms from '@/components/Breadcrumbs'
import StudentsSubmissionsList from './StudentsSubmissionsList'

const StudentsSubmissions = async ({
  params,
}: {
  params: Promise<{ id: string; submissionId: string }>
}) => {
  const id = (await params).id
  const submissionId = (await params).submissionId

  console.log(id, 'id')
  console.log(submissionId, 'submissionId')

  const breadcrumbArray = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Courses',
      href: '/courses',
    },
    {
      title: 'Course Details',
      href: `/courses/${id}`,
    },
    {
      title: 'Students Submissions',
      href: `/courses/${id}/students-submissions`,
    },
  ]

  return (
    <div>
      <Breadcrubms breadcrumbArray={breadcrumbArray} />
      <StudentsSubmissionsList id={id} submissionId={submissionId} />
    </div>
  )
}

export default StudentsSubmissions
