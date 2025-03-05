import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { format } from 'date-fns'
import { FileText, Calendar } from 'lucide-react'
import { Button } from '../ui/button'
import { useParams } from 'next/navigation'

export interface DueDate {
  year: number
  month: number
  day: number
}

export interface DueTime {
  hours: number
  minutes: number
}

export const formatDueDateTime = (dueDate?: DueDate, dueTime?: DueTime) => {
  if (!dueDate) return 'No due date'

  const date = new Date(
    dueDate.year,
    dueDate.month - 1,
    dueDate.day,
    dueTime?.hours || 0,
    dueTime?.minutes || 0,
  )

  return format(date, 'MMM d, yyyy, h:mm a')
}

// Calculate days remaining until due date
export const getDaysRemaining = (dueDate?: DueDate) => {
  if (!dueDate) return null

  const today = new Date()
  const due = new Date(dueDate.year, dueDate.month - 1, dueDate.day)

  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

const CourseCard = ({ courseWork }: { courseWork: any }) => {
  const { id } = useParams()
  //   console.log(id, 'id')
  // Format due date and time
  const daysRemaining = getDaysRemaining(courseWork.dueDate)

  return (
    <Card key={courseWork.id} className="overflow-hidden flex flex-col  ">
      <CardHeader className="">
        <CardTitle className="text-xl ">{courseWork.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col  gap-5">
        <div className="flex flex-col gap-2 ">
          <div className="flex items-center gap-2 ">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Assigned to {courseWork.totalSubmissions} Students</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{courseWork.assignment.studentWorkFolder.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {
                daysRemaining !== null
                  ? `Due in ${daysRemaining} days (${formatDueDateTime(courseWork.dueDate, courseWork.dueTime)})`
                  : 'No due date'
                // Fix this to overdue, as it is giving negative numbers now
              }
            </span>
          </div>
        </div>
        <div className="flex flex-row bg-muted gap-5 ">
          <div className="bg-primary p-5 text-center text-white w-1/2 rounded-lg">
            <div className="text-primary-foreground text-2xl font-bold">
              {courseWork.gradedSubmissions}
            </div>
            <div className="text-primary-foreground text-xs">To Grade</div>
          </div>
          <div className="bg-amber-500 p-4 text-center text-white w-1/2 rounded-lg">
            <div className="text-2xl font-bold">{courseWork.ungradedSubmissions}</div>
            <div className="text-xs">Not turned in</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className=" ">
        <Button variant="secondary" className="w-full rounded-lg  py-5 text-sm font-medium" asChild>
          <Link href={`/dashboard/courses/${id}/submissions/${courseWork.id}`}>
            View student submissions
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CourseCard
