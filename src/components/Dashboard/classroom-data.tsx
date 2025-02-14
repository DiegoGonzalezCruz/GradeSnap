'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useClassroomSummary } from '@/hooks/classroom/useClassroomSummary'

export function ClassroomData() {
  const { data, error, isLoading } = useClassroomSummary()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.courses}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.students}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.assignments}</div>
        </CardContent>
      </Card>
    </>
  )
}
