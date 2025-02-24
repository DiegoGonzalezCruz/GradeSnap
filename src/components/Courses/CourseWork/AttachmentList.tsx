import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AttachmentListProps {
  attachments: any[]
}

export const AttachmentList = ({ attachments }: AttachmentListProps) => {
  // console.log(attachments, 'attachments')
  return (
    <div className="flex gap-2">
      {attachments.length > 0 ? (
        attachments.map(
          (attachment: any, index: any) =>
            attachment.driveFile && (
              <TooltipProvider key={attachment.driveFile.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={attachment.driveFile.alternateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <img
                        src={attachment.driveFile.thumbnailUrl || '/placeholder.svg'}
                        alt={attachment.driveFile.title}
                        className="h-8 w-8 rounded object-cover"
                      />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{attachment.driveFile.title}</p>
                  </TooltipContent>
                </Tooltip>
                <Button variant="outline" size="icon" asChild>
                  <a
                    href={attachment.driveFile?.alternateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </TooltipProvider>
            ),
        )
      ) : (
        <span className="text-muted-foreground">No attachments</span>
      )}
    </div>
  )
}
