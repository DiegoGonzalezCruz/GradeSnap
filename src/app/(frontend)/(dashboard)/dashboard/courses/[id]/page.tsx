'use client'

import { useCourseDetails } from '@/hooks/classroom/useCourseDetails'
import { useParams } from 'next/navigation'
import { AssignmentUser } from '@/components/Dashboard/AssignmentUser'
import { CreateCriterionDialog } from '@/components/Dashboard/CreateCriterionDialog'
import { EditCriterionDialog } from '@/components/Dashboard/EditCriterionDialog'

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: courseDetails, isLoading, isError } = useCourseDetails(id as string)

  if (isLoading) {
    return <div>Loading course details...</div>
  }

  if (isError) {
    return <div>Error fetching course details.</div>
  }

  if (!courseDetails) {
    return <div>Course not found.</div>
  }

  const { assignments, course, rubrics } = courseDetails
  console.log(assignments, ' *********** ASSIGNMENTS **************')
  console.log(course, ' *********** COURSE **************')
  console.log(rubrics, ' *********** RUBRICS **************')

  return (
    <div>
      <h1 className="text-2xl font-black">{courseDetails.course.name}</h1>
      <p>{course.description}</p>
      <p>Room: {course.room}</p>
      <p>Section: {course.section}</p>
      <p>Last Updated: {course.updateTime}</p>

      <h2 className="text-2xl font-black">Assignments</h2>
      <div>
        {assignments[0].map((assignment: any, idx: number) => {
          console.log(assignment, '***** ASSIGNMENT *****')
          return (
            <div key={assignment.id + idx}>
              <AssignmentUser
                key={assignment.id + idx}
                userId={assignment.userId}
                assignmentId={assignment.id}
                idx={idx}
                attachments={assignment.attachments}
              />
            </div>
          )
        })}
      </div>
      <h2 className="text-2xl font-black">Rubrics</h2>
      <CreateCriterionDialog rubricId={id as string} />
      <div>
        {rubrics &&
          rubrics[0]?.map((rubricList: any, idx: number) => (
            <div key={idx}>
              <h3>Rubric {idx + 1}</h3>
              {rubricList?.criteria?.map((criterion: any) => (
                <div key={criterion.id}>
                  <h4>{criterion.title}</h4>
                  <EditCriterionDialog rubricId={id as string} criterionId={criterion.id} />
                  <ul>
                    {criterion.levels.map((level: any) => (
                      <li key={level.id}>
                        {level.title} - {level.points} points
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  )
}
