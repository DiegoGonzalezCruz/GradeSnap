'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Calendar, FileText, GraduationCap, LayoutDashboard, Search, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Assignment, CourseWork, Rubric } from './types'
import SubmissionsTable from './submission-table'
import RubricView from './rubric.view'
import useGradeAssignment from '@/hooks/gemini/useGradeAssignment'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface DashboardProps {
  courseWorks: CourseWork[]
  assignments: Record<string, Assignment[]>
  rubrics: Record<string, Rubric>
}

export default function CourseWorkDetails({ courseWorks, assignments, rubrics }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [courseId, setCourseId] = useState('')
  const [courseWorkId, setCourseWorkId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null)
  const { grade, feedback, loading, gradeAssignment } = useGradeAssignment()

  const filteredCourseWorks = courseWorks.filter((work) =>
    work.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDueDate = (work: CourseWork) => {
    if (!work.dueDate) return 'No due date'
    const date = new Date(
      work.dueDate.year,
      work.dueDate.month - 1,
      work.dueDate.day,
      work.dueTime?.hours || 0,
      work.dueTime?.minutes || 0,
    )
    return format(date, 'PPp')
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6 p-8">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Course Dashboard</h1>
            <Button onClick={() => setOpen(true)}>Create Rubric</Button>
          </div>
          <p className="text-muted-foreground">Manage your course assignments and submissions.</p>
        </div>
      </header>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Rubric</DialogTitle>
            <DialogDescription>Create a new rubric for this course.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="courseId" className="text-right">
                Course ID
              </label>
              <Input
                id="courseId"
                className="col-span-3"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="courseWorkId" className="text-right">
                Course Work ID
              </label>
              <Input
                id="courseWorkId"
                className="col-span-3"
                value={courseWorkId}
                onChange={(e) => setCourseWorkId(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right">
                Title
              </label>
              <Input
                id="title"
                className="col-span-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <textarea
                id="description"
                className="col-span-3 rounded-md border px-3 py-2 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={async () => {
                try {
                  const res = await fetch('/api/classroom/rubrics', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      courseId,
                      courseWorkId,
                      title,
                      description,
                    }),
                  })
                  if (res.ok) {
                    setOpen(false)
                    window.location.reload()
                  } else {
                    alert('Failed to create rubric')
                  }
                } catch (error) {
                  alert('Failed to create rubric')
                }
              }}
            >
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="submissions" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Submissions
          </TabsTrigger>
          <TabsTrigger value="rubrics" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Rubrics
          </TabsTrigger>
          <TabsTrigger value="grading" className="flex items-center gap-2">
            Grading
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="flex items-center justify-end">
            <div className="relative w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourseWorks.map((work) => (
              <Card key={work.id} className="cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{work.title}</span>
                    <Button variant="outline" size="icon">
                      <Users className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDueDate(work)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{work.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {assignments[work.id]?.length || 0} submissions
                    </div>
                    <div className="text-sm font-medium">{work.maxPoints} points</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="submissions">
          <SubmissionsTable assignments={assignments} courseWorks={courseWorks} />
        </TabsContent>

        <TabsContent value="rubrics">
          <RubricView rubrics={rubrics} courseWorks={courseWorks} />
        </TabsContent>

        <TabsContent value="grading">
          <div className="flex items-center justify-between">
            <label htmlFor="assignment">Select Assignment</label>
            <select id="assignment" onChange={(e) => setSelectedAssignment(e.target.value)}>
              {assignments &&
                Object.entries(assignments).map(([key, value]) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
            </select>
          </div>
          {selectedAssignment && (
            <div>
              {assignments[selectedAssignment][0]?.attachments[0]?.driveFile?.alternateLink ||
                'No attachment'}
              <Button
                onClick={async () => {
                  const alternateLink =
                    assignments[selectedAssignment][0]?.attachments[0]?.driveFile?.alternateLink
                  if (alternateLink) {
                    const res = await fetch(alternateLink)
                    const fileContent = await res.text()
                    const rubric = rubrics[selectedAssignment]
                    if (rubric) {
                      await gradeAssignment(fileContent, rubric)
                    } else {
                      alert('Rubric not found for this assignment')
                    }
                  }
                }}
              >
                Grade
              </Button>
              {loading && <div>Loading...</div>}
              {grade && <div>Grade: {grade}</div>}
              {feedback && <div>Feedback: {feedback}</div>}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
