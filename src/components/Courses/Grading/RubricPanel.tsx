import React from 'react'
import { Loader2, Star } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { RubricCriterion } from '@/types/courses'

interface RubricPanelProps {
  rubric: any
  rubricLoading: boolean
  selectedLevels: Record<string, string>
  onLevelSelect: (criterionId: string, levelId: string) => void
  gradeResult?: {
    criteria: {
      criterionId: string
      criterionTitle: string
      justification: string
      score: number
    }[]
  }
}

export default function RubricPanel({
  rubric,
  rubricLoading,
  selectedLevels,
  onLevelSelect,
  gradeResult,
}: RubricPanelProps) {
  if (rubricLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!rubric) {
    return <p className="text-center p-4 text-muted-foreground">No rubric available</p>
  }

  return (
    <div className="space-y-2 mb-4">
      <h3 className="text-sm font-medium mb-2">Grading Rubric</h3>
      {rubric.criteria.map((criterion: RubricCriterion) => {
        // Check if the grade result contains data for this criterion
        const gradedCriterion = gradeResult?.criteria.find((c) => c.criterionId === criterion.id)
        return (
          <Collapsible key={criterion.id} className="border rounded-md">
            <CollapsibleTrigger className="flex w-full justify-between items-center p-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">{criterion.title}</span>
                {gradedCriterion && (
                  <div className="flex gap-1" title={`Score: ${gradedCriterion.score}`}>
                    {Array.from({ length: gradedCriterion.score }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 text-yellow-500" />
                    ))}
                  </div>
                )}
                {!gradedCriterion && selectedLevels[criterion.id] && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {criterion.levels.find((l) => l.id === selectedLevels[criterion.id])?.title}
                  </span>
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 border-t">
              <p className="text-sm text-muted-foreground mb-3">{criterion.description}</p>
              <RadioGroup
                value={selectedLevels[criterion.id] || ''}
                onValueChange={(value) => onLevelSelect(criterion.id, value)}
                className="space-y-2"
              >
                {criterion.levels.map((level) => {
                  const isObtained = gradedCriterion && level.points === gradedCriterion.score
                  return (
                    <div
                      key={level.id}
                      className={`flex items-start space-x-2 p-2 rounded-md hover:bg-gray-50 ${
                        isObtained ? 'bg-blue-100' : ''
                      }`}
                    >
                      <RadioGroupItem value={level.id} id={level.id} className="mt-1" />
                      <div className="grid gap-1">
                        <Label htmlFor={level.id} className="font-medium">
                          {level.title} ({level.points} {level.points === 1 ? 'point' : 'points'})
                        </Label>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                        {isObtained && <p className="text-xs text-blue-700">Obtained!</p>}
                      </div>
                    </div>
                  )
                })}
              </RadioGroup>
              {gradedCriterion && (
                <div className="mt-2 p-2 border-t">
                  <p className="text-sm font-medium">LLM Feedback:</p>
                  <p className="text-xs text-muted-foreground">{gradedCriterion.justification}</p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        )
      })}
    </div>
  )
}
