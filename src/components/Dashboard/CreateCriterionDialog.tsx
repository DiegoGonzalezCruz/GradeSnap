// src/components/Dashboard/CreateCriterionDialog.tsx

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
import { createCriterion } from '@/lib/classroom/rubrics'

interface CreateCriterionDialogProps {
  rubricId: string
}

type FormData = {
  title: string
  description: string
}

export function CreateCriterionDialog({ rubricId }: CreateCriterionDialogProps) {
  const { register, handleSubmit, reset } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      await createCriterion(rubricId, data)
      reset()
      // TODO: Show success message
    } catch (error) {
      console.error('Failed to create criterion:', error)
      // TODO: Show error message
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Criterion</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Criterion</DialogTitle>
          <DialogDescription>Add a new criterion to the rubric.</DialogDescription>
        </DialogHeader>
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
          <Button type="submit">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
