'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useClassroomStats } from '@/hooks/classroom/useClassroomSummary'
import { Skeleton } from '../ui/skeleton'

export function ClassroomData() {
  const { data: stats, error, isLoading, isSuccess } = useClassroomStats()

  if (isLoading) {
    return (
      <div className="flex flex-row items-center justify-between gap-20 w-full h-full ">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="flex flex-col w-1/3">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) return <div>{error.message}</div>

  if (isSuccess)
    return (
      <div className="flex flex-row items-center justify-between gap-20 w-full h-full ">
        <Card className="flex flex-col w-1/3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.courses}</div>
          </CardContent>
        </Card>
        <Card className="flex flex-col w-1/3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.students}</div>
          </CardContent>
        </Card>
        <Card className="flex flex-col w-1/3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignments}</div>
          </CardContent>
        </Card>
      </div>
    )
}
