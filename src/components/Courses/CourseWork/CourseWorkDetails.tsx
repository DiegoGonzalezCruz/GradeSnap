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

interface DashboardProps {
  courseWorks: CourseWork[]
  assignments: Record<string, Assignment[]>
  rubrics: Record<string, Rubric>
}

export default function CourseWorkDetails({ courseWorks, assignments, rubrics }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')

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
            <Button>Create Rubric</Button>
          </div>
          <p className="text-muted-foreground">Manage your course assignments and submissions.</p>
        </div>
      </header>

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
      </Tabs>
    </div>
  )
}
