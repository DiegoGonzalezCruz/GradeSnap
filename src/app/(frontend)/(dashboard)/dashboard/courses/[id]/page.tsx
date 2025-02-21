'use client'

import { useCourseDetails } from '@/hooks/classroom/useCourseDetails'
import { useParams } from 'next/navigation'
import { AssignmentUser } from '@/components/Dashboard/AssignmentUser'
import { CreateCriterionDialog } from '@/components/Dashboard/CreateCriterionDialog'
import { EditCriterionDialog } from '@/components/Dashboard/EditCriterionDialog'
import CourseWorkDetails from '@/components/Courses/CourseWork/CourseWorkDetails'

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

  const { assignments, course, rubrics, courseWork } = courseDetails
  console.log(assignments, ' *********** ASSIGNMENTS **************')
  console.log(course, ' *********** COURSE **************')
  console.log(rubrics, ' *********** RUBRICS **************')
  console.log(courseWork, ' *********** COURSE WORK **************')

  return (
    <div>
      <h1 className="text-2xl font-black">{courseDetails.course.name}</h1>
      <p>{course.description}</p>
      <p>Room: {course.room}</p>
      <p>Section: {course.section}</p>
      <p>Last Updated: {course.updateTime}</p>

      <CourseWorkDetails courseWorks={courseWork} assignments={assignments} rubrics={rubrics} />

      {/* <h2 className="">Assignments</h2>

      <div className="flex flex-col gap-10">
        {assignments.map((assignment: any, idx: number) => {
          console.log(assignment, '***** ASSIGNMENT  *****', idx)
          return (
            <div className="card bg-primary p-5 rounded-xl" key={idx}>
              {assignment.map((a, idx) => {
                return (
                  <AssignmentUser
                    key={a.id + idx}
                    userId={a.userId}
                    assignmentId={a.id}
                    idx={idx}
                    attachments={a.attachments}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
      <h2 className="text-2xl font-black">Rubrics</h2>
      {/* <CreateCriterionDialog courseId={id as string} courseWorkId="748987146785" /> */}
      {/* <div className="flex flex-col gap-10">
        {rubrics &&
          rubrics?.map((rubricList: any, idx: number) => {
            console.log(rubricList, '***** RUBRIC LIST *****', idx)
            return (
              <div key={idx} className="flex flex-col gap-10">
                <h3>Rubric</h3>
                {rubricList[0]?.criteria?.map((criterion: any) => (
                  <div key={criterion.id} className="card bg-primary p-5 rounded-xl">
                    <h4>{criterion.title}</h4>

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
            )
          })}
      </div> */}
    </div>
  )
}
