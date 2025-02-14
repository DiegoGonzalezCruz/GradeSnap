import { Sidebar } from '@/components/Dashboard/sidebar'
import type React from 'react'
import { draftMode } from 'next/headers'
import HeaderDashboard from '@/components/Dashboard/header'
import MainDashboard from '@/components/Dashboard/main'

export const metadata = {
  title: 'Classroom AI Dashboard',
  description: 'AI-powered grading and announcements for Google Classroom',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <div className="flex flex-row h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 overflow-y-auto ">
        <Sidebar />
      </aside>
      <div className="flex flex-col flex-1 overflow-hidden debug1 h-full">
        {/* Header */}
        <HeaderDashboard />
        {/* Main */}
        <MainDashboard>{children}</MainDashboard>
      </div>
    </div>
  )
}
