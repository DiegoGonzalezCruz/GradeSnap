import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AttachmentListProps {
  attachments: any[]
}

export const AttachmentList = ({ attachments }: AttachmentListProps) => {
  // console.log(attachments, 'attachments')
  return (
    <div className="flex flex-col">
      {attachments.length > 0 ? (
        attachments.map(
          (attachment: any, index: any) =>
            attachment.driveFile && (
              <div
                key={attachment.driveFile.id}
                className="flex flex-row items-center justify-start gap-2"
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={attachment.driveFile.alternateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        {attachment.driveFile.title}
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{attachment.driveFile.title}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Button variant="outline" size="icon" asChild className="w-5 h-5">
                    <a
                      href={attachment.driveFile?.alternateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </TooltipProvider>
              </div>
            ),
        )
      ) : (
        <span className="text-muted-foreground">No attachments</span>
      )}
    </div>
  )
}
