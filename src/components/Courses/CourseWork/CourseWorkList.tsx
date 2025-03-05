'use client'

import { isEqual } from 'date-fns'
import { Search, Filter } from 'lucide-react'
import { useState, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/date-picker'
import { useCourseWork } from '@/hooks/classroom/useCourseWork'
import CourseCard from '../CourseCard'

// Sample data for demonstration

export default function CourseWorkList({ id }: { id: string }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)

  const { data, isLoading, isError } = useCourseWork(id)
  // console.log(data, 'course work list')

  // Filter course works based on search query and date filter
  const filteredCourseWorks = useMemo(() => {
    if (!data) return []

    return data.filter((courseWork) => {
      // Filter by title
      const titleMatch = courseWork.title.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter by date
      let dateMatch = true
      if (dateFilter && courseWork.dueDate) {
        const dueDate = new Date(
          courseWork.dueDate.year,
          courseWork.dueDate.month - 1,
          courseWork.dueDate.day,
        )

        dateMatch = isEqual(
          new Date(dateFilter.getFullYear(), dateFilter.getMonth(), dateFilter.getDate()),
          new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()),
        )
      }

      return titleMatch && dateMatch
    })
  }, [data, searchQuery, dateFilter])

  if (isLoading) {
    return <div>Loading course work...</div>
  }

  if (isError) {
    return <div>Error loading course work</div>
  }
  // console.log(data, 'Data ***')

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 ">
        <div className="flex flex-col space-y-2 md:flex-row items-center justify-end md:space-x-2 md:space-y-0  w-full">
          <div className="relative ">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title..."
              className="pl-8 w-full md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DatePicker date={dateFilter} onSelect={setDateFilter} className="w-full md:w-auto " />
          {dateFilter && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDateFilter(undefined)}
              className="h-10 w-10 "
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {filteredCourseWorks.length === 0 && (
        <div className="rounded-md border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No assignments found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or date filters
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredCourseWorks.map((courseWork) => {
          return <CourseCard key={courseWork.id} courseWork={courseWork} />
        })}
      </div>
    </div>
  )
}
