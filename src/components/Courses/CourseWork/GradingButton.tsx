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
import { useRubrics } from '@/hooks/classroom/useRubrics'
import { useParams } from 'next/navigation'

const GradingButton = () => {
  const params = useParams<{ id: string }>()
  const { id } = params

  console.log(id, '**** search ****')

  const { data, isLoading, isSuccess } = useRubrics(id)

  console.log(data, '**** data ****')

  // State for selected assignment key
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  // If data is not available yet, show a loading state
  if (isLoading) return <p>Loading rubrics...</p>
  if (!isSuccess || !data) return <p>No rubrics found.</p>

  // Get all object keys (IDs of rubrics)
  const rubricKeys = Object.keys(data)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          Grade
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Rubric</DialogTitle>
          <DialogDescription>Select a rubric to grade this submission.</DialogDescription>
        </DialogHeader>

        {/* Dropdown or Buttons to Select Assignment Key */}
        <div className="flex flex-col gap-2">
          <label>Select an Assignment:</label>
          <select
            className="p-2 border rounded-md"
            value={selectedKey || ''}
            onChange={(e) => setSelectedKey(e.target.value)}
          >
            <option value="" disabled>
              Select an assignment
            </option>
            {rubricKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        {/* Display rubrics for the selected assignment */}
        {selectedKey && data[selectedKey] && (
          <div className="flex flex-col gap-4 mt-4">
            <h3 className="font-bold text-lg">Rubrics for Assignment {selectedKey}</h3>
            {data[selectedKey].criteria.map((rubric) => (
              <button
                key={rubric.id}
                className="p-2 border rounded-md bg-gray-200 hover:bg-gray-300"
                onClick={() => console.log(rubric)}
              >
                {rubric.title}
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default GradingButton
