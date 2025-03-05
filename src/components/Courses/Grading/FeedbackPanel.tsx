import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface FeedbackPanelProps {
  feedback: string
  editingFeedback: boolean
  onFeedbackChange: (newFeedback: string) => void
  onToggleEdit: () => void
  gradeResult?: {
    overallFeedback: string
    criteria: {
      criterionId: string
      criterionTitle: string
      justification: string
      score: number
    }[]
  }
}

export default function FeedbackPanel({
  feedback,
  editingFeedback,
  onFeedbackChange,
  onToggleEdit,
  gradeResult,
}: FeedbackPanelProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">AI Feedback for Student</CardTitle>
      </CardHeader>
      <CardContent>
        {editingFeedback ? (
          <div className="space-y-2">
            <Textarea
              value={feedback}
              onChange={(e) => onFeedbackChange(e.target.value)}
              className="min-h-[200px]"
            />
            <Button size="sm" onClick={onToggleEdit} className="w-full">
              Save Feedback
            </Button>
          </div>
        ) : gradeResult ? (
          <>
            <p className="text-sm mb-2">
              <strong>Overall Feedback:</strong> {gradeResult.overallFeedback}
            </p>
            <ul className="list-disc pl-4">
              {gradeResult.criteria.map((criterion) => (
                <li key={criterion.criterionId} className="text-sm mb-1">
                  <strong>{criterion.criterionTitle}:</strong> {criterion.justification}
                </li>
              ))}
            </ul>
            {/* <Button variant="outline" size="sm" onClick={onToggleEdit} className="w-full mt-2">
              Edit Feedback
            </Button> */}
          </>
        ) : (
          <>
            <p className="text-sm mb-2">{feedback}</p>
            <Button variant="outline" size="sm" onClick={onToggleEdit} className="w-full">
              Edit Feedback
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
