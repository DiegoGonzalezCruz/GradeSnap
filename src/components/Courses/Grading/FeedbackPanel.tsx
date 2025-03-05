import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface FeedbackPanelProps {
  feedback: string
  editingFeedback: boolean
  onFeedbackChange: (newFeedback: string) => void
  onToggleEdit: () => void
}

export default function FeedbackPanel({
  feedback,
  editingFeedback,
  onFeedbackChange,
  onToggleEdit,
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
