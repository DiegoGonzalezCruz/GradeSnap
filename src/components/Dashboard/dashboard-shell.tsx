import { cn } from '@/utilities/ui'
import type React from 'react'

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DashboardShell({ children, className, ...props }: DashboardShellProps) {
  return (
    <div className={cn('grid items-start gap-8', className)} {...props}>
      {children}
    </div>
  )
}
