'use client'
import useMeUser from '@/hooks/useMeUser'
import React from 'react'

const HeaderDashboard = () => {
  const { user, isLoading, error } = useMeUser()
  // console.log(user, 'user ***')
  return (
    <header className="p-12 ">
      <h1 className="text-xl font-bold">
        Welcome back,{' '}
        {isLoading ? <span className="animate-pulse">...</span> : user?.name || 'Teacher!'}
      </h1>
      <p>{"Here's what's happening in your classes"}</p>
    </header>
  )
}

export default HeaderDashboard
