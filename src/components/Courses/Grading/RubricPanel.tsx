import React from 'react'
import { Loader2 } from 'lucide-react'
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
        // If this criterion was graded by the LLM, find that result
        const gradedCriterion = gradeResult?.criteria.find((c) => c.criterionId === criterion.id)

        // If there's an LLM-graded score, select that level in the radio group.
        // Otherwise, fall back to the user-selected level (manual).
        const selectedValue = gradedCriterion
          ? criterion.levels.find((l) => l.points === gradedCriterion.score)?.id
          : selectedLevels[criterion.id] || ''

        return (
          <Collapsible key={criterion.id} className="border rounded-md">
            <CollapsibleTrigger className="flex w-full justify-between items-center p-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">{criterion.title}</span>

                {/* Display a badge for whichever level is currently "selectedValue" */}
                {selectedValue && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    {criterion.levels.find((level) => level.id === selectedValue)?.title}
                  </span>
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 border-t flex flex-col gap-5">
              <p className="text-sm text-muted-foreground mb-3">{criterion.description}</p>
              <RadioGroup
                value={selectedValue}
                onValueChange={(value) => onLevelSelect(criterion.id, value)}
                className="space-y-2"
              >
                {criterion.levels.map((level) => (
                  <div
                    key={level.id}
                    className="flex items-start space-x-2 p-2 rounded-md hover:bg-gray-50"
                  >
                    <RadioGroupItem value={level.id} id={level.id} className="mt-1" />
                    <div className="grid gap-1">
                      <Label htmlFor={level.id} className="font-medium">
                        {level.title} ({level.points} {level.points === 1 ? 'point' : 'points'})
                      </Label>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              {/* If there is LLM feedback, display it below the levels */}
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
