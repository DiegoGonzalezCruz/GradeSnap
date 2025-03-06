'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CourseWorkListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-col space-y-2 md:flex-row items-center justify-end md:space-x-2 md:space-y-0 w-full">
          <div className="relative w-full md:w-[250px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Skeleton className="h-10 w-full pl-8" />
          </div>
          <Skeleton className="h-10 w-full md:w-[180px]" />
          <Button variant="ghost" size="icon" className="h-10 w-10" disabled>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
