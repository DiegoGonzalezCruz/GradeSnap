// src/components/Dashboard/EditCriterionDialog.tsx

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { updateCriterion, getCriterion } from '@/lib/classroom/rubrics'
import { useEffect, useState } from 'react'

interface EditCriterionDialogProps {
  rubricId: string
  criterionId: string
}

type FormData = {
  title: string
  description: string
}

export function EditCriterionDialog({ rubricId, criterionId }: EditCriterionDialogProps) {
  const { register, handleSubmit, setValue } = useForm<FormData>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCriterion = async () => {
      setIsLoading(true)
      try {
        const criterion = await getCriterion(rubricId, criterionId)
        setValue('title', criterion.title)
        setValue('description', criterion.description)
      } catch (error) {
        console.error('Failed to fetch criterion:', error)
        // TODO: Show error message
      } finally {
        setIsLoading(false)
      }
    }

    fetchCriterion()
  }, [criterionId, rubricId, setValue])

  const onSubmit = async (data: FormData) => {
    try {
      await updateCriterion(rubricId, criterionId, data)
      // TODO: Show success message
    } catch (error) {
      console.error('Failed to update criterion:', error)
      // TODO: Show error message
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Criterion</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Criterion</DialogTitle>
          <DialogDescription>Edit the criterion details.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Criterion Title" {...register('title')} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Criterion Description"
                {...register('description')}
                required
              />
            </div>
            <Button type="submit">Update</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
