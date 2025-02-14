import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
const GetStats = () => {
  // This is where you'd fetch and process AI-graded assessments
  const mockAssessments = [
    { id: 1, name: 'Math Quiz', averageScore: 85, totalSubmissions: 30 },
    { id: 2, name: 'English Essay', averageScore: 78, totalSubmissions: 28 },
    { id: 3, name: 'Science Test', averageScore: 92, totalSubmissions: 32 },
  ]
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Assessment</TableHead>
          <TableHead>Average Score</TableHead>
          <TableHead>Submissions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockAssessments.map((assessment) => (
          <TableRow key={assessment.id}>
            <TableCell>{assessment.name}</TableCell>
            <TableCell>{assessment.averageScore}%</TableCell>
            <TableCell>{assessment.totalSubmissions}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default GetStats
