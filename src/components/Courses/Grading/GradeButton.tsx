import React from 'react'
import { Loader2, Rocket, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GradeButtonProps {
  gradingLoading: boolean
  rubric: any
  selectedFile: any
  selectedLevels: Record<string, string>
  totalCriteria: number
  onGradeClick: (rubric: any, fileUrl: string) => void
  label?: string
  icon?: React.ReactNode
}

export default function GradeButton({
  gradingLoading,
  rubric,
  selectedFile,
  selectedLevels,
  totalCriteria,
  onGradeClick,
  label = 'Grade',
  icon = <Rocket className="h-4 w-4 mr-1" />,
}: GradeButtonProps) {
  const handleClick = () => {
    if (selectedFile) {
      onGradeClick(rubric, selectedFile.driveFile.alternateLink)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={
        gradingLoading ||
        !rubric ||
        !selectedFile ||
        Object.keys(selectedLevels).length < totalCriteria
      }
    >
      {gradingLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Grading...
        </>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </Button>
  )
}
