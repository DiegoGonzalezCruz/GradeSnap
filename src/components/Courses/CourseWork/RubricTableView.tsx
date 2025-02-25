import React from 'react'
import { Rubric } from './types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const RubricTableView = ({ rubric }: { rubric: Rubric }) => {
  return rubric.criteria.map((criterion) => (
    <div key={criterion.id} className="space-y-4 overflow-scroll">
      <div>
        <h4 className="text-lg font-semibold">{criterion.title}</h4>
        <p className="text-sm text-muted-foreground">{criterion.description}</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Level</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-24">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {criterion.levels.map((level) => (
            <TableRow key={level.id}>
              <TableCell className="font-medium">{level.title}</TableCell>
              <TableCell>{level.description}</TableCell>
              <TableCell>{level.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ))
}

export default RubricTableView
