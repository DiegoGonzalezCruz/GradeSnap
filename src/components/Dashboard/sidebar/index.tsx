'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type React from 'react' // Import React
import { cn } from '@/utilities/ui'
import { CrumpledPaperIcon, HomeIcon } from '@radix-ui/react-icons'
import { BarChart, Cog, Rocket } from 'lucide-react'
import Image from 'next/image'
import AvatarSidebar from './AvatarSidebar'

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
      icon: CrumpledPaperIcon,
      href: '/dashboard/courses',
      active: pathname === '/courses',
    },
    {
      name: 'Rubric',
      icon: Rocket,
      href: '/dashboard/rubrics',
      active: pathname === '/rubrics',
    },
    // {
    //   name: 'Summaries',
    //   icon: BarChart,
    //   href: '/dashboard/summaries',
    //   active: pathname === '/summaries',
    // },
    {
      name: 'Settings',
      icon: Cog,
      href: '/dashboard/settings',
      active: pathname === '/settings',
    },
  ]

  return (
    <div className={cn(' h-screen  min-h-fit  ', className)}>
      <div className="h-full w-full">
        <div className="h-full flex flex-col justify-around items-center px-12  ">
          <div className="w-full ">
            <Image
              src="/logos/logo-darkbackground.svg"
              alt="Gradesnap logo"
              width={200}
              height={50}
            />
          </div>
          <div className="flex flex-col justify-center items-center gap-10  text-secondary-foreground ">
            {menu.map((item) => {
              const Icon = item.icon
              return (
                <Link href={item.href} key={item.name}>
                  <div className="h-fit px-[25px] py-5 flex flex-col justify-center items-center gap-5  ">
                    <div data-svg-wrapper className="relative">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="  text-sm font-normal text-center ">{item.name}</div>
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="w-full">
            <AvatarSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
