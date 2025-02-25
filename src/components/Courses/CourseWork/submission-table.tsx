import { format } from 'date-fns'
import { FileText, Search, Eye } from 'lucide-react'
import { useState } from 'react'

import { CourseWork, Rubrics } from './types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { useAllSubmissions } from '@/hooks/classroom/useAllSubmissions'
import { StatusIndicator } from './StatusIndicator'
import { AttachmentList } from './AttachmentList'
import GradingButton from './GradingButton'

interface SubmissionsTableProps {
  submissions: Record<string, any[]>
  courseWorks: CourseWork[]
  rubrics: Rubrics
}

export default function SubmissionsTable({
  submissions,
  courseWorks,
  rubrics,
}: SubmissionsTableProps) {
  const [status, setStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const allSubmissions = useAllSubmissions({
    submissions,
    courseWorks,
    status,
    searchQuery,
  })

  // console.log(allSubmissions, '****** ALL SUBMISSIONS')
  // console.log(submissions, 'SUBMISSIONS')
  // console.log(rubrics, 'RUBRICS')
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">All Submissions</h2>
          <p className="text-sm text-muted-foreground">Track and manage student submissions</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search submissions..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select defaultValue="all" onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Submissions</SelectItem>
              <SelectItem value="turned-in">Turned In</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
              <SelectItem value="created">Not Turned In</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Assignment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Attachments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No submissions yet</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              allSubmissions.map((submission: any) => {
                // console.log(submission, 'submission ***** MAP')
                const courseWork = courseWorks.find((cw) => cw.id === submission.courseWorkId)
                const attachments = submission.assignmentSubmission?.attachments || []

                return (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.user.name.fullName}</TableCell>
                    <TableCell>{courseWork?.title || 'Unknown Assignment'}</TableCell>
                    <TableCell>
                      <StatusIndicator state={submission.state} />
                    </TableCell>
                    <TableCell>
                      {submission.assignedGrade !== undefined ? (
                        <span className="font-medium">
                          {submission.assignedGrade}/{courseWork?.maxPoints || 100}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Not graded</span>
                      )}
                    </TableCell>
                    <TableCell>{format(new Date(submission.updateTime), 'PP p')}</TableCell>
                    <TableCell>
                      <AttachmentList attachments={attachments} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <a
                            href={submission.alternateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <GradingButton
                          attachments={attachments}
                          courseWorks={submission.courseWorkId}
                          rubrics={rubrics}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
