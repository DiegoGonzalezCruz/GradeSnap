import React from 'react'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCourseInfo } from '@/hooks/classroom/useCourseInfo'

interface RubricMissingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courseId: string
  courseWorkId: string
}

export default function RubricMissingDialog({
  open,
  onOpenChange,
  courseId,
  courseWorkId,
}: RubricMissingDialogProps) {
  const { data: courseData } = useCourseInfo(courseId!)
  console.log(courseData, 'course data')

  const handleOpenInClassroom = () => {
    // Construct Google Classroom URL for the specific courseWork

    window.open(courseData.alternateLink, '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rubric Missing</DialogTitle>
          <DialogDescription>
            A rubric is required to grade this submission. Please open this assignment in Google
            Classroom to create or attach a rubric.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <div className="grid flex-1 gap-2">
            <p className="text-sm text-muted-foreground">
              After creating the rubric in Google Classroom, return to GradeSnap and refresh this
              page to continue grading.
            </p>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="default" onClick={handleOpenInClassroom}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in Google Classroom
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
