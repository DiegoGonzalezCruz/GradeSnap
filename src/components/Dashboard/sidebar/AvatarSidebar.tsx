'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '@/payload-types'
import { useAuth } from '@payloadcms/ui'
import React from 'react'

const AvatarSidebar = () => {
  const { user } = useAuth<User>()

  console.log(user, 'user')

  return (
    <div className="w-full  text-secondary-foreground gap-5 flex flex-col">
      <h2 className="text-base font-medium"> Teacher </h2>
      <div className="flex flex-row items-center justify-between">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>User Name</div>
      </div>
    </div>
  )
}

export default AvatarSidebar
