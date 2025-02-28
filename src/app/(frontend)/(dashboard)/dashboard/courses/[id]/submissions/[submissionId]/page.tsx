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

  return (
    <div>
      <StudentsSubmissionsList id={id} submissionId={submissionId} />
    </div>
  )
}

export default StudentsSubmissions
