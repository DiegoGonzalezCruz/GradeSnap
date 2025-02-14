import React from 'react'

interface MainDashboardProps {
  children: React.ReactNode
}

const MainDashboard: React.FC<MainDashboardProps> = ({ children }) => {
  return <main className="flex-1 p-10 overflow-y-auto bg-white">{children}</main>
}

export default MainDashboard
