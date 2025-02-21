import { format } from 'date-fns'
import { FileText, Search, Eye, Download } from 'lucide-react'

import { Assignment, CourseWork } from './types'
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useState } from 'react'

interface SubmissionsTableProps {
  assignments: Record<string, any[]>
  courseWorks: CourseWork[]
}

export default function SubmissionsTable({ assignments, courseWorks }: SubmissionsTableProps) {
  const [status, setStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Flatten all assignments into a single array
  const allAssignments = Object.values(assignments)
    .flat()
    .filter((assignment: any) => {
      if (status === 'all') return true
      if (status === 'turned-in' && assignment.state === 'TURNED_IN') return true
      if (status === 'returned' && assignment.state === 'RETURNED') return true
      if (
        status === 'created' &&
        assignment.state !== 'TURNED_IN' &&
        assignment.state !== 'RETURNED'
      )
        return true
      return false
    })
    .filter((assignment: any) => {
      const courseWork = courseWorks.find((cw) => cw.id === assignment.courseWorkId)
      if (!courseWork) return false
      return courseWork.title.toLowerCase().includes(searchQuery.toLowerCase())
    })

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
            {allAssignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No submissions yet</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              allAssignments.map((assignment) => {
                const courseWork = courseWorks.find((cw) => cw.id === assignment.courseWorkId)
                const attachments = assignment.assignmentSubmission?.attachments || []

                return (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.user.name.fullName}</TableCell>
                    <TableCell>{courseWork?.title || 'Unknown Assignment'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            assignment.state === 'RETURNED'
                              ? 'bg-green-500'
                              : assignment.state === 'TURNED_IN'
                                ? 'bg-blue-500'
                                : 'bg-yellow-500'
                          }`}
                        />
                        {assignment.state}
                      </div>
                    </TableCell>
                    <TableCell>
                      {assignment.assignedGrade !== undefined ? (
                        <span className="font-medium">
                          {assignment.assignedGrade}/{courseWork?.maxPoints || 100}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Not graded</span>
                      )}
                    </TableCell>
                    <TableCell>{format(new Date(assignment.updateTime), 'PP p')}</TableCell>
                    <TableCell>
                      {attachments.length > 0 ? (
                        <div className="flex gap-2">
                          {attachments.map(
                            (attachment: any, index: any) =>
                              attachment.driveFile && (
                                <TooltipProvider key={attachment.driveFile.id}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <a
                                        href={attachment.driveFile.alternateLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block"
                                      >
                                        <img
                                          src={
                                            attachment.driveFile.thumbnailUrl || '/placeholder.svg'
                                          }
                                          alt={attachment.driveFile.title}
                                          className="h-8 w-8 rounded object-cover"
                                        />
                                      </a>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{attachment.driveFile.title}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ),
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No attachments</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" asChild>
                          <a
                            href={assignment.alternateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        {attachments.length > 0 && (
                          <Button variant="outline" size="icon" asChild>
                            <a
                              href={attachments[0].driveFile?.alternateLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
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
