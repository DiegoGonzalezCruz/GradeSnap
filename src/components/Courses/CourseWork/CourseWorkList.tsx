'use client'

import { format, isEqual } from 'date-fns'
import { FileText, Search, Calendar, Filter } from 'lucide-react'
import { useState, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DatePicker } from '@/components/ui/date-picker'
import { useCourseWork } from '@/hooks/classroom/useCourseWork'
import Link from 'next/link'

// Define the types based on the provided data structure
interface Material {
  driveFile?: {
    driveFile: {
      id: string
      title: string
      alternateLink: string
      thumbnailUrl: string
    }
    shareMode: string
  }
}

interface DueDate {
  year: number
  month: number
  day: number
}

interface DueTime {
  hours: number
  minutes: number
}

interface Assignment {
  studentWorkFolder: {
    id: string
    title: string
    alternateLink: string
  }
}

interface CourseWork {
  courseId: string
  id: string
  title: string
  description: string
  materials: Material[]
  state: string
  alternateLink: string
  creationTime: string
  updateTime: string
  dueDate?: DueDate
  dueTime?: DueTime
  maxPoints: number
  workType: string
  submissionModificationMode: string
  assignment: Assignment
  assigneeMode: string
  creatorUserId: string
  topicId: string
}

// Mock data for submissions count - in a real app, this would come from an API
interface SubmissionStats {
  [key: string]: {
    total: number
    graded: number
    ungraded: number
  }
}

// Sample data for demonstration

export default function CourseWorkList({ id }: { id: string }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState('all')

  // In a real app, this would be fetched from an API
  const { data, isLoading, isError } = useCourseWork(id)
  // console.log(data, 'course work list')
  // Calculate days remaining until due date
  const getDaysRemaining = (dueDate?: DueDate) => {
    if (!dueDate) return null

    const today = new Date()
    const due = new Date(dueDate.year, dueDate.month - 1, dueDate.day)

    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  // Format due date and time
  const formatDueDateTime = (dueDate?: DueDate, dueTime?: DueTime) => {
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

  // Filter course works based on search query and date filter
  const filteredCourseWorks = useMemo(() => {
    if (!data) return []

    return data.filter((courseWork) => {
      // Filter by title
      const titleMatch = courseWork.title.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter by date
      let dateMatch = true
      if (dateFilter && courseWork.dueDate) {
        const dueDate = new Date(
          courseWork.dueDate.year,
          courseWork.dueDate.month - 1,
          courseWork.dueDate.day,
        )

        dateMatch = isEqual(
          new Date(dateFilter.getFullYear(), dateFilter.getMonth(), dateFilter.getDate()),
          new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()),
        )
      }

      return titleMatch && dateMatch
    })
  }, [data, searchQuery, dateFilter])

  if (isLoading) {
    return <div>Loading course work...</div>
  }

  if (isError) {
    return <div>Error loading course work</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Course - SPANISH 101</h2>
          <p className="text-sm text-muted-foreground">
            List of all active assignments listed on your course
          </p>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title..."
              className="pl-8 w-full md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DatePicker date={dateFilter} onSelect={setDateFilter} className="w-full md:w-auto" />
          {dateFilter && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDateFilter(undefined)}
              className="h-10 w-10"
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredCourseWorks.map((courseWork) => {
          const daysRemaining = getDaysRemaining(courseWork.dueDate)

          return (
            <Card key={courseWork.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{courseWork.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Assigned to {courseWork.totalSubmissions} Students
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{courseWork.assignment.studentWorkFolder.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {daysRemaining !== null
                        ? `Due in ${daysRemaining} days (${formatDueDateTime(courseWork.dueDate, courseWork.dueTime)})`
                        : 'No due date'}
                    </span>
                  </div>
                </div>
              </CardContent>

              <div className="grid grid-cols-2 gap-px bg-muted">
                <div className="bg-green-500 p-4 text-center text-white">
                  <div className="text-2xl font-bold">{courseWork.gradedSubmissions}</div>
                  <div className="text-xs">Graded</div>
                </div>
                <div className="bg-amber-500 p-4 text-center text-white">
                  <div className="text-2xl font-bold">{courseWork.ungradedSubmissions}</div>
                  <div className="text-xs">Ungraded</div>
                </div>
              </div>

              <CardFooter className="p-0 ">
                <Button
                  variant="ghost"
                  className="w-full rounded-none py-6 text-sm font-medium"
                  asChild
                >
                  <Link href={`/dashboard/courses/${id}/submissions/${courseWork.id}`}>
                    View student submissions
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {filteredCourseWorks.length === 0 && (
        <div className="rounded-md border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No assignments found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or date filters
          </p>
        </div>
      )}
    </div>
  )
}
