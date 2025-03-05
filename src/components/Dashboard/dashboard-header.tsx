import type React from 'react' // Import React
import HeaderDashboard from './header'

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-start w-full">
      {/* <div className="grid gap-1">
        <h1 className="font-heading text-3xl md:text-4xl">{heading}</h1>
        {text && <p className="text-lg text-muted-foreground">{text}</p>} */}
      <HeaderDashboard />
      {/* </div> */}
      {children}
    </div>
  )
}
