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
import { Attachments, CourseWork, Rubric, Rubrics } from './types'
import RubricTableView from './RubricTableView'

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
  console.log(submissionId, 'submission Id FROM DIALOG')
  console.log(courseWorks, 'course works FROM DIALOG')
  console.log(rubrics, ' rubrics FROM DIALOG')
  console.log(attachments, 'attachemnts FROM DIALOG')
  const params = useParams<{ id: string }>()
  const { id } = params
  const rubric = rubrics[courseWorks]
  console.log(rubric, 'rubric id FROM DIALOG')

  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  const rubricsKeys = Object.keys(rubrics)
  // console.log(rubricsKeys, 'rubric keys')

  // console.log(id, '**** search ****')

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
        {/* Dropdown or Buttons to Select Assignment Key */}
        <div className="flex flex-col gap-2 overflow-auto">
          <Label>Select a CourseWork:</Label>
          <select
            className="p-2 border rounded-md"
            value={selectedKey || ''}
            onChange={(e) => setSelectedKey(e.target.value)}
          >
            <option value="" disabled>
              Select an submission
            </option>
            {attachments.map((attachment) => {
              // console.log(attachment, '🚨🚨🚨🚨🚨🚨')
              return (
                <option key={attachment.driveFile.id} value={attachment.driveFile.alternateLink}>
                  {attachment.driveFile.title}
                </option>
              )
            })}
          </select>
        </div>
        {/* Select file to grade against */}
        <div className="flex flex-col gap-2 overflow-scroll">
          <Label>Select an Assignment to grade:</Label>
          {rubric && <RubricTableView rubric={rubric} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GradingButton
