import { Sidebar } from '@/components/Dashboard/sidebar'

import type React from 'react' // Import React

export const metadata = {
  title: 'Classroom AI Dashboard',
  description: 'AI-powered grading and announcements for Google Classroom',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={''}>
      <div className="flex h-screen overflow-hidden">
        <aside className="hidden w-64 overflow-y-auto border-r bg-gray-100/40 md:block">
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-y-auto bg-white p-4">{children}</main>
      </div>
    </div>
  )
}
