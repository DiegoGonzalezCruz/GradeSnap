'use client'
import React, { useState } from 'react'
import { Sidebar } from '@/components/Dashboard/sidebar'
import MainDashboard from '@/components/Dashboard/main'
import { HiOutlineMenu } from 'react-icons/hi'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Mobile header with hamburger */}
      <div className="md:hidden flex items-center justify-between p-4 bg-secondary">
        <button onClick={toggleSidebar} aria-label="Toggle sidebar">
          <HiOutlineMenu className="w-6 h-6 text-white" />
        </button>
        <div className="text-white font-bold">Dashboard</div>
      </div>

      <div className="flex flex-1 ">
        {/* Sidebar for desktop */}
        <aside className="hidden md:block w-64 bg-secondary text-secondary-foreground overflow-y-auto">
          <Sidebar />
        </aside>

        {/* Mobile sidebar overlay with animation */}
        <div
          className={`md:hidden fixed inset-0 z-50 flex transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className={`w-64 bg-secondary text-secondary-foreground overflow-y-auto transition-transform duration-300 transform ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <Sidebar />
          </div>
          {/* Clicking the overlay background closes the sidebar */}
          <div className="flex-1" onClick={toggleSidebar} />
        </div>

        {/* Main dashboard */}
        <div className="flex flex-col flex-1 overflow-hidden ">
          <MainDashboard>{children}</MainDashboard>
        </div>
      </div>
    </div>
  )
}
