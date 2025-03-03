'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import RubricTableView from './RubricTableView'
import { getClientSideURL } from '@/utilities/getURL'
import { toast } from 'sonner'

type GradingButtonProps = {
  attachments: any[]
  courseWorkId: string
}

const GradingButton = ({ attachments, courseWorkId }: GradingButtonProps) => {
  const params = useParams<{ id: string }>()
  const { id: courseId } = params

  // Fetch rubric using React Query
  const {
    data: rubric,
    isLoading: rubricLoading,
    error: rubricError,
  } = useQuery({
    queryKey: ['rubric', courseId, courseWorkId],
    queryFn: async () => {
      const res = await fetch(
        `/api/classroom/rubrics?courseId=${courseId}&courseWorkId=${courseWorkId}`,
      )
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch rubric.')
      }
      return data.rubrics && data.rubrics.length > 0 ? data.rubrics[0] : {}
    },
    enabled: !!courseId && !!courseWorkId,
  })

  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [gradingLoading, setGradingLoading] = useState(false)
  const [gradeResult, setGradeResult] = useState<string | null>(null)

  const handleGradeClick = async (rubric: any, selectedFile: string) => {
    setGradingLoading(true)
    setGradeResult(null)
    try {
      const res = await fetch(`${getClientSideURL()}/api/classroom/grading`, {
        method: 'POST',
        body: JSON.stringify({ rubric, url: selectedFile }),
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
      setGradingLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" type="button" disabled={rubricLoading}>
          {rubricLoading ? (
            <>
              <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                  fill="none"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  className="opacity-75"
                />
              </svg>
              Loading Rubric...
            </>
          ) : (
            'Grade Submission'
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Grading & Evaluation</DialogTitle>
          <DialogDescription>
            Select a file from the submission and review the rubric criteria before grading.
          </DialogDescription>
        </DialogHeader>
        {/* File selection dropdown */}
        <div className="flex flex-col gap-2">
          <Label>Select a file to evaluate:</Label>
          <select
            className="p-2 border rounded-md"
            value={selectedFile || ''}
            onChange={(e) => setSelectedFile(e.target.value)}
          >
            <option value="" disabled>
              -- Choose a file --
            </option>
            {attachments.map((attachment) => (
              <option key={attachment.driveFile.id} value={attachment.driveFile.alternateLink}>
                {attachment.driveFile.title}
              </option>
            ))}
          </select>
        </div>
        {/* Rubric details */}
        <div className="flex flex-col gap-2 mt-4">
          <Label>Rubric Criteria:</Label>
          {rubric ? (
            <RubricTableView rubric={rubric} />
          ) : (
            <p>No rubric available for this coursework.</p>
          )}
        </div>
        {/* Grade button */}
        <div className="w-full flex justify-center mt-4">
          {rubric && selectedFile && (
            <Button
              onClick={() => handleGradeClick(rubric, selectedFile)}
              disabled={gradingLoading}
            >
              {gradingLoading ? (
                <>
                  <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                      fill="none"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      className="opacity-75"
                    />
                  </svg>
                  Grading...
                </>
              ) : (
                'Submit Grade'
              )}
            </Button>
          )}
        </div>
        {/* Display grading result */}
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
