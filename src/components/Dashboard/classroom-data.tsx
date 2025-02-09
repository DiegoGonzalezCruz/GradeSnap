'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'

export function ClassroomData() {
  const [data, setData] = useState({ courses: 0, students: 0, assignments: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/classroom/summary')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch classroom data')
        return res.json()
      })
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError('Error loading classroom data')
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

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
