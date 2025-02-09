import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function AIGradedAssessments() {
  // This is where you'd fetch and process AI-graded assessments
  const mockAssessments = [
    { id: 1, name: 'Math Quiz', averageScore: 85, totalSubmissions: 30 },
    { id: 2, name: 'English Essay', averageScore: 78, totalSubmissions: 28 },
    { id: 3, name: 'Science Test', averageScore: 92, totalSubmissions: 32 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Graded Assessments</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
