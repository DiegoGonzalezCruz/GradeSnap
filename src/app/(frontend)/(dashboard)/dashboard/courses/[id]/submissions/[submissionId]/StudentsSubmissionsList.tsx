'use client'

import { useState } from 'react'
import { useGetSubmissionsFromCourseWork } from '@/hooks/classroom/useSubmissions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { FileIcon, ExternalLinkIcon } from 'lucide-react'

type Submission = {
  courseId: string
  courseWorkId: string
  id: string
  userId: string
  creationTime: string
  updateTime: string
  state: string
  late: boolean
  alternateLink: string
  courseWorkType: string
  assignmentSubmission?: {
    attachments?: Array<{
      driveFile?: {
        id: string
        title: string
        alternateLink: string
        thumbnailUrl: string
      }
    }>
  }
  submissionHistory: Array<{
    stateHistory: {
      state: string
      stateTimestamp: string
      actorUserId: string
    }
  }>
  user: {
    id: string
    name: {
      givenName: string
      familyName: string
      fullName: string
    }
  }
  attachments: any[]
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

const getStatusBadge = (state: string) => {
  switch (state) {
    case 'TURNED_IN':
      return <Badge className="bg-purple-600 hover:bg-purple-700">Turned in</Badge>
    case 'CREATED':
      return <Badge variant="outline">Created</Badge>
    case 'RECLAIMED_BY_STUDENT':
      return <Badge variant="secondary">Reclaimed</Badge>
    case 'RETURNED':
      return <Badge className="bg-green-600 hover:bg-green-700">Reviewed</Badge>
    case 'GRADED':
      return <Badge className="bg-blue-600 hover:bg-blue-700">Graded</Badge>
    default:
      return <Badge variant="outline">Pending Review</Badge>
  }
}

const getLatestState = (history: Submission['submissionHistory']) => {
  if (!history || history.length === 0) return 'CREATED'

  // Filter out any items with missing data
  const validHistory = history.filter(
    (item) => item && item.stateHistory && item.stateHistory.stateTimestamp,
  )

  if (validHistory.length === 0) return 'CREATED'

  // Sort by timestamp in descending order and get the latest state
  const sortedHistory = [...validHistory].sort((a, b) => {
    const dateA = new Date(a.stateHistory.stateTimestamp).getTime()
    const dateB = new Date(b.stateHistory.stateTimestamp).getTime()
    return dateB - dateA
  })

  return sortedHistory[0]?.stateHistory?.state || 'CREATED'
}

const StudentsSubmissionsList = ({ id, submissionId }: { id: string; submissionId: string }) => {
  const { data, isLoading } = useGetSubmissionsFromCourseWork(id, submissionId)
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null)

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  const submissions = Array.isArray(data) ? data : [data].filter(Boolean)
  console.log(submissions, 'submissions')

  if (!submissions || submissions.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">No submissions found</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Student Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Deadline</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Grade</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Last Updated
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Attachments</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission: Submission) => {
              const latestState = getLatestState(submission?.submissionHistory || [])
              const hasAttachments =
                submission?.assignmentSubmission?.attachments &&
                submission.assignmentSubmission.attachments.length > 0

              return (
                <tr key={submission.id} className="border-b hover:bg-muted/50">
                  <td className="px-4 py-3">
                    {submission?.user?.name?.fullName || 'Unknown Student'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {/* Placeholder deadline - would come from courseWork data */}
                    March 01, 2025, 11:59PM
                  </td>
                  <td className="px-4 py-3">{submission?.state || latestState || 'CREATED'}</td>
                  <td className="px-4 py-3">Not graded</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {submission?.updateTime ? formatDate(submission.updateTime) : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    {hasAttachments ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setExpandedSubmission(
                            expandedSubmission === submission.id ? null : submission.id,
                          )
                        }
                      >
                        <FileIcon className="mr-2 h-4 w-4" />
                        View attachments
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">No attachments</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(latestState)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Expanded attachment view */}
      {expandedSubmission &&
        submissions.map((submission: Submission) => {
          if (submission.id !== expandedSubmission) return null

          return (
            <div key={`expanded-${submission.id}`} className="p-4 bg-muted/20 border-t">
              <h3 className="font-medium mb-2">Attachments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {submission.assignmentSubmission?.attachments?.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 border rounded-md bg-card"
                  >
                    {attachment.driveFile?.thumbnailUrl ? (
                      <img
                        src={attachment.driveFile.thumbnailUrl || '/placeholder.svg'}
                        alt={attachment.driveFile.title}
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      <FileIcon className="h-10 w-10 text-muted-foreground" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {attachment.driveFile?.title || 'Untitled'}
                      </p>
                      <p className="text-xs text-muted-foreground">Google Drive File</p>
                    </div>
                    {attachment.driveFile?.alternateLink && (
                      <Button size="sm" variant="ghost" asChild>
                        <a
                          href={attachment.driveFile.alternateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLinkIcon className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
    </Card>
  )
}

export default StudentsSubmissionsList
