'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import type React from 'react' // Import React
import { cn } from '@/utilities/ui'

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()

  return (
    <div className={cn('pb-12', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
          <div className="space-y-1">
            <Button
              variant={pathname === '/' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              asChild
            >
              <Link href="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
                Overview
              </Link>
            </Button>
            <Button
              variant={pathname === '/assessments' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              asChild
            >
              <Link href="/assessments">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                Assessments
              </Link>
            </Button>
            <Button
              variant={pathname === '/announcements' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              asChild
            >
              <Link href="/announcements">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Announcements
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
