import React from 'react'
import { Label } from '@/components/ui/label'
import { Attachment } from '@/types/courses'

interface FileSelectorProps {
  attachments: Attachment[]
  selectedFile: Attachment | null
  onSelectFile: (file: Attachment) => void
}

export default function FileSelector({
  attachments,
  selectedFile,
  onSelectFile,
}: FileSelectorProps) {
  return (
    <div className="flex flex-col gap-5">
      <Label>Select a file to evaluate:</Label>
      <select
        className="p-2 border rounded-md"
        value={selectedFile ? selectedFile.driveFile.alternateLink : ''}
        onChange={(e) => {
          const file = attachments.find(
            (attachment) => attachment.driveFile.alternateLink === e.target.value,
          )
          if (file) onSelectFile(file)
        }}
      >
        <option value="" disabled>
          -- Choose a file --
        </option>
        {attachments.map((attachment) => (
          <option key={attachment.driveFile.id} value={attachment.driveFile.alternateLink}>
            {attachment.driveFile.title}
          </option>
        ))}
      </select>
    </div>
  )
}
