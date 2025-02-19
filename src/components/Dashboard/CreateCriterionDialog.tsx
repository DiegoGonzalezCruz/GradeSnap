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
import { useRouter } from 'next/navigation'

interface CreateCriterionDialogProps {
  courseId: string
  courseWorkId: string
}

type FormData = {
  title: string
  description: string
}

export function CreateCriterionDialog({ courseId, courseWorkId }: CreateCriterionDialogProps) {
  const { register, handleSubmit, reset } = useForm<FormData>()
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(
        `/api/classroom/rubrics?courseId=${courseId}&courseWorkId=${courseWorkId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      reset()
      router.refresh()
      // TODO: Show success message
    } catch (error) {
      console.error('Failed to create criterion:', error)
      // TODO: Show error message
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Rubric</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Rubric</DialogTitle>
          <DialogDescription>Add a new rubric to the course work.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Rubric Title" {...register('title')} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Rubric Description"
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
