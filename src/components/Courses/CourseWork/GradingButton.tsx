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
import { CourseWork, Rubric, Rubrics } from './types'

const GradingButton = ({
  submissionId,
  courseWorks,
  rubrics,
}: {
  submissionId: string
  courseWorks: CourseWork[]
  rubrics: Rubrics
}) => {
  // console.log(submissionId, 'submission Id FROM DIALOG')
  // console.log(courseWorks, 'course works FROM DIALOG')
  // console.log(rubrics, ' rubrics FROM DIALOG')
  const params = useParams<{ id: string }>()
  const { id } = params

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Rubric</DialogTitle>
          <DialogDescription>Select a rubric to grade against.</DialogDescription>
        </DialogHeader>
        {/* Dropdown or Buttons to Select Assignment Key */}
        <div className="flex flex-col gap-2">
          <Label>Select a CourseWork:</Label>
          <select
            className="p-2 border rounded-md"
            value={selectedKey || ''}
            onChange={(e) => setSelectedKey(e.target.value)}
          >
            <option value="" disabled>
              Select an submission
            </option>
            {courseWorks.map((courseWork) => (
              <option key={courseWork.id} value={courseWork.id}>
                {courseWork.title}
              </option>
            ))}
          </select>
        </div>
        {/* Select file to grade against */}
        <div className="flex flex-col gap-2">
          <Label>Select an Assignment to grade:</Label>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GradingButton
