'use client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import useMeUser from '@/hooks/useMeUser'

import Image from 'next/image'
import React from 'react'

const AvatarSidebar = () => {
  const { user, isLoading, error } = useMeUser()
  console.log(user, 'user')
  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        {/* Skeleton for the avatar */}
        <Skeleton className="h-10 w-10 rounded-full" />
        {/* Skeleton for the user’s name */}
        <Skeleton className="h-5 w-32" />
      </div>
    )
  }
  if (error) {
    return <p>Error: {error.message}</p>
  }

  return (
    <div className="w-full  text-secondary-foreground gap-5 flex flex-col">
      <h2 className="text-base font-medium"> Teacher </h2>
      <div className="flex flex-col items-center justify-between  gap-5">
        <Avatar className="">
          {user?.pictureURL && (
            <Image src={user?.pictureURL} alt={'Teacher Image '} width={40} height={40} />
          )}
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="w-full flex flex-col ">
          <div>{user?.name}</div>
          <div className="text-[10px]">{user?.email}</div>
        </div>
      </div>
    </div>
  )
}

export default AvatarSidebar
