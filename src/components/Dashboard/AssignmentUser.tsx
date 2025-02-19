'use client'

import { useUserDetails } from '@/hooks/classroom/useUserDetails'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface AssignmentUserProps {
  userId: string
  assignmentId: string
  idx: number
  attachments: any[]
}

export function AssignmentUser({ userId, assignmentId, idx, attachments }: AssignmentUserProps) {
  const {
    data: userDetails,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useUserDetails(userId)

  if (isUserLoading) {
    return <li key={assignmentId + idx}>Loading user details...</li>
  }

  if (isUserError) {
    return <li key={assignmentId + idx}>Error fetching user details.</li>
  }

  if (!userDetails) {
    return <li key={assignmentId + idx}>User not found.</li>
  }

  return (
    <div key={assignmentId + idx}>
      <Dialog>
        <DialogTrigger asChild>
          <button className="text-blue-500 hover:underline">
            {userDetails.name.fullName} ({userDetails.emailAddress})
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              {attachments.length > 0 ? (
                <ul>
                  {attachments.map((attachment: any, index: number) => (
                    <li key={index}>
                      <a
                        href={attachment.driveFile.alternateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {attachment.driveFile.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>No attachments found.</div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
