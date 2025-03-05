import React from 'react'
import { Calendar, ExternalLink, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface StudentInfoCardProps {
  submissionData: any // Replace with the actual type
}

// Format date for display
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a")
  } catch (error) {
    return dateString
  }
}

// Get status badge color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'TURNED_IN':
      return 'bg-green-100 text-green-800'
    case 'CREATED':
      return 'bg-blue-100 text-blue-800'
    case 'RETURNED':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Get initials for avatar
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

const StudentInfoCard: React.FC<StudentInfoCardProps> = ({ submissionData }) => {
  const submissionAttachments = submissionData?.attachments || []

  return (
    <Card className="m-4 border shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* <Avatar className="h-10 w-10">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${submissionData.user.name.fullName.replace(/ /g, '+')}&background=random`}
            />
            <AvatarFallback>{getInitials(submissionData.user.name.fullName)}</AvatarFallback>
          </Avatar> */}
          <div>
            <CardTitle className="text-base">{submissionData?.user?.name?.fullName}</CardTitle>
            <CardDescription>
              <Badge className={getStatusColor(submissionData?.state)}>
                {submissionData?.state.replace(/_/g, ' ')}
              </Badge>
            </CardDescription>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" asChild>
                <a href={submissionData.alternateLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View in Google Classroom</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="flex items-center text-muted-foreground mb-1">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>Submitted: {formatDate(submissionData.updateTime)}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <FileText className="h-3.5 w-3.5 mr-1" />
          <span>
            {submissionAttachments.length} attachment
            {submissionAttachments.length !== 1 ? 's' : ''}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export default StudentInfoCard
