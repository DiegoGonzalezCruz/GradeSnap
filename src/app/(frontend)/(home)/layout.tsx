import { Sidebar } from '@/components/Dashboard/sidebar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { AdminBar } from '@/components/AdminBar'
import type React from 'react' // Import React
import { draftMode } from 'next/headers'

export const metadata = {
  title: 'Classroom AI Dashboard',
  description: 'AI-powered grading and announcements for Google Classroom',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <>
      <AdminBar adminBarProps={{ preview: isEnabled }} />
      <Header />
      {children}
      <Footer />
    </>
  )
}
