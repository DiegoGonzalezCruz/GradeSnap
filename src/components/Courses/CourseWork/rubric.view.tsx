import { Plus, Search } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
import { CourseWork, Rubric } from './types'
import RubricTableView from './RubricTableView'

export interface RubricViewProps {
  rubrics: Record<string, Rubric>
  courseWorks: CourseWork[]
}

export default function RubricView({ rubrics, courseWorks }: RubricViewProps) {
  const [selectedRubric, setSelectedRubric] = useState<Rubric | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rubrics</h2>
          <p className="text-sm text-muted-foreground">Manage assessment criteria and scoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search rubrics..." className="pl-8 w-[250px]" />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Rubric
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(rubrics).map(([courseWorkId, rubric]) => {
          const courseWork = courseWorks.find((cw) => cw.id === courseWorkId)
          return (
            <Card
              key={rubric.id}
              className="cursor-pointer transition-shadow hover:shadow-lg"
              onClick={() => setSelectedRubric(rubric)}
            >
              <CardHeader>
                <CardTitle className="text-lg">
                  {courseWork?.title || 'Unnamed Assignment'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {rubric.criteria.length} criteria
                  </div>
                  <div className="space-y-1">
                    {rubric.criteria.map((criterion) => (
                      <div key={criterion.id} className="text-sm">
                        • {criterion.title}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedRubric && (
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold">Rubric Details</h3>
            <p className="text-sm text-muted-foreground">View and edit rubric criteria</p>
          </div>
          <RubricTableView rubric={selectedRubric} />
        </div>
      )}
    </div>
  )
}
