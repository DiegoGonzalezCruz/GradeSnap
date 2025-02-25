'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Attachments, Rubric, Rubrics } from './types'
import RubricTableView from './RubricTableView'
import { getClientSideURL } from '@/utilities/getURL'
import { toast } from 'sonner'

const GradingButton = ({
  submissionId,
  attachments,
  courseWorks,
  rubrics,
}: {
  submissionId: string
  attachments: Attachments
  courseWorks: string
  rubrics: Rubrics
}) => {
  const params = useParams<{ id: string }>()
  const { id } = params
  const rubric = rubrics[courseWorks]

  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [gradeResult, setGradeResult] = useState<string | null>(null)

  const handleGradeClick = async (rubric: Rubric, selectedKey: string) => {
    setLoading(true)
    setGradeResult(null)
    try {
      const res = await fetch(`${getClientSideURL()}/api/classroom/grading`, {
        method: 'POST',
        body: JSON.stringify({ rubric, url: selectedKey }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to grade submission.')
      }
      setGradeResult(data.grade)
      toast('Grading completed successfully.')
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to grade submission.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" type="button">
          Grade
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl overflow-y-scroll debug1">
        <DialogHeader>
          <DialogTitle>Select a Rubric</DialogTitle>
          <DialogDescription>Select a rubric to grade against.</DialogDescription>
        </DialogHeader>
        {/* Dropdown to select submission */}
        <div className="flex flex-col gap-2 overflow-auto">
          <Label>Select a CourseWork:</Label>
          <select
            className="p-2 border rounded-md"
            value={selectedKey || ''}
            onChange={(e) => setSelectedKey(e.target.value)}
          >
            <option value="" disabled>
              Select a submission
            </option>
            {attachments.map((attachment) => (
              <option key={attachment.driveFile.id} value={attachment.driveFile.alternateLink}>
                {attachment.driveFile.title}
              </option>
            ))}
          </select>
        </div>
        {/* Display rubric details */}
        <div className="flex flex-col gap-2 overflow-scroll">
          <Label>Select an Assignment to grade:</Label>
          {rubric && <RubricTableView rubric={rubric} />}
        </div>
        {/* Grade button */}
        <div className="w-full flex flex-row items-center justify-center">
          {rubric && selectedKey && (
            <Button onClick={() => handleGradeClick(rubric, selectedKey)} disabled={loading}>
              {loading ? 'Grading...' : 'Grade'}
            </Button>
          )}
        </div>
        {/* Display the grading result */}
        {gradeResult && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <Label>Grading Result:</Label>
            <pre className="text-sm whitespace-pre-wrap">{gradeResult}</pre>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default GradingButton
