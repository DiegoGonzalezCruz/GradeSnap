import React from 'react'
import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'
import { Separator } from '../ui/separator'

const CourseCardLoading = () => {
  return (
    <Card className="w-full mx-auto p-5 gap-5 flex flex-col">
      {/* Top section (title + view all) */}
      <div className="flex justify-between items-center w-full">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* List of skeleton “cards” */}
      <div className="w-full flex flex-col gap-5">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex flex-col w-full gap-5">
            <div>
              <div className="flex items-center justify-between gap-6">
                {/* Icon skeleton */}
                <Skeleton className="h-12 w-12 rounded bg-muted" />

                <div className="flex-1 min-w-0">
                  <div className="flex flex-row items-center gap-5">
                    {/* Course name + ID */}
                    <div className="w-1/4 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>

                    {/* Stats (students, submissions, deadline) */}
                    <div className="flex items-center gap-6 flex-1">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-5 w-8" />
                      </div>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-5 w-8" />
                      </div>
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-5 w-8" />
                      </div>
                    </div>

                    {/* Button skeleton */}
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </div>
            </div>
            {/* Separator between skeleton items */}
            {idx < 2 && <Separator />}
          </div>
        ))}
      </div>
    </Card>
  )
}

export default CourseCardLoading
