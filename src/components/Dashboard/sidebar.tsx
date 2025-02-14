'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import type React from 'react' // Import React
import { cn } from '@/utilities/ui'
import { HomeIcon } from '@radix-ui/react-icons'
import { Icon } from 'lucide-react'

interface Menu {
  name: string
  icon: React.ElementType // This accepts a component, like HomeIcon
  href: string
  active?: boolean
}

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()

  const menu: Menu[] = [
    {
      name: 'Home',
      icon: HomeIcon,
      href: '/dashboard',
      active: pathname === '/',
    },
    {
      name: 'Courses',
      icon: HomeIcon,
      href: '/dashboard/courses',
      active: pathname === '/courses',
    },
    {
      name: 'Grading',
      icon: HomeIcon,
      href: '/dashboard/grading',
      active: pathname === '/grading',
    },
    {
      name: 'Summaries',
      icon: HomeIcon,
      href: '/dashboard/summaries',
      active: pathname === '/summaries',
    },
    {
      name: 'Settings',
      icon: HomeIcon,
      href: '/dashboard/settings',
      active: pathname === '/settings',
    },
  ]

  return (
    <div className={cn(' h-[80dvh] min-h-fit  ', className)}>
      <div className="h-full w-full">
        <div className="h-full flex flex-col justify-around items-center gap-3   ">
          <div>
            <h2 className=" text-lg font-semibold tracking-tight">Header Menu</h2>
          </div>
          <div className="flex flex-col justify-center items-center gap-10  ">
            {menu.map((item) => {
              const Icon = item.icon
              return (
                <>
                  <div className="h-fit px-[25px] py-2 flex flex-col justify-center items-center   ">
                    <div data-svg-wrapper className="relative">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className=" text-black text-sm font-normal text-center ">{item.name}</div>
                  </div>
                </>
              )
            })}
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Footer Menu</h2>
          </div>
        </div>
      </div>
    </div>
  )
}
