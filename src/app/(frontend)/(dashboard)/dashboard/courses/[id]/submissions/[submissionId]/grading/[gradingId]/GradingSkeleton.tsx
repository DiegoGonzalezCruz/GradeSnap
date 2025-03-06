'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function GradingSkeleton() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Panel: Grading Controls */}
      <div className="w-full md:w-1/3 border-r overflow-y-auto p-4">
        <Skeleton className="h-20 w-full mb-4" /> {/* Student Info Card */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <Tabs className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="rubric">
              <Skeleton className="h-6 w-16" />
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <Skeleton className="h-6 w-16" />
            </TabsTrigger>
            <TabsTrigger value="history">
              <Skeleton className="h-6 w-16" />
            </TabsTrigger>
          </TabsList>
          <div className="p-4">
            <TabsContent value="rubric" className="mt-0">
              <Skeleton className="h-40 w-full" />
            </TabsContent>
            <TabsContent value="feedback" className="mt-0">
              <Skeleton className="h-20 w-full" />
            </TabsContent>
            <TabsContent value="history" className="mt-0">
              <Skeleton className="h-20 w-full" />
            </TabsContent>
          </div>
        </Tabs>
        <Skeleton className="h-12 w-full mt-4" /> {/* Confirm and Submit Grade Button */}
      </div>

      {/* Right Panel: Document Viewer */}
      <div className="w-full md:w-2/3 p-4 bg-gray-50 flex flex-col gap-5 h-[85vh]">
        <Skeleton className="h-12 w-full" /> {/* File Selector */}
        <Skeleton className="h-full w-full" /> {/* PDF Viewer */}
      </div>
    </div>
  )
}
