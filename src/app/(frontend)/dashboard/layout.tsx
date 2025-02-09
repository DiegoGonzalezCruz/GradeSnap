import { Sidebar } from '@/components/Dashboard/sidebar'
import { Inter } from 'next/font/google'

import type React from 'react' // Import React

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Classroom AI Dashboard',
  description: 'AI-powered grading and announcements for Google Classroom',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen overflow-hidden">
          <aside className="hidden w-64 overflow-y-auto border-r bg-gray-100/40 md:block">
            <Sidebar />
          </aside>
          <main className="flex-1 overflow-y-auto bg-white p-4">{children}</main>
        </div>
      </body>
    </html>
  )
}
