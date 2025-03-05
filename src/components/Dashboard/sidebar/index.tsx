'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type React from 'react'
import { cn } from '@/utilities/ui'
import { HomeIcon } from '@radix-ui/react-icons'
import { FaGraduationCap } from 'react-icons/fa'
import { LuBookOpenCheck } from 'react-icons/lu'

import { Rocket, Cog } from 'lucide-react'
import Image from 'next/image'
import AvatarSidebar from './AvatarSidebar'
import { Button } from '@/components/ui/button'
import { CiLogout } from 'react-icons/ci'
import { useRouter } from 'next/navigation'
import useMeUser from '@/hooks/useMeUser'

interface Menu {
  name: string
  icon: React.ElementType
  href: string
}

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()
  const router = useRouter()
  const user = useMeUser()

  console.log(user, 'user')
  if (!user) router.push('/')

  const menu: Menu[] = [
    {
      name: 'Home',
      icon: HomeIcon,
      href: '/dashboard', // matches pathname if user is at /dashboard
    },
    {
      name: 'Courses',
      icon: FaGraduationCap,
      href: '/dashboard/courses', // highlight if user is on /dashboard/courses
    },
    {
      name: 'Rubric',
      icon: LuBookOpenCheck,
      href: '/dashboard/rubrics',
    },
    {
      name: 'Settings',
      icon: Cog,
      href: '/dashboard/settings',
    },
  ]

  const handleLogout = async () => {
    console.log('logging out')
    const res = await fetch('/api/users/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (res.ok) {
      router.push('/')
    }
  }

  return (
    <div className={cn('h-screen min-h-fit bg-[#0B0F2D]', className)}>
      <div className="h-full w-full flex flex-col justify-around items-center px-12 py-6">
        {/* Logo */}
        <div className="w-full mb-8">
          <Image
            src="/logos/logo-darkbackground.svg"
            alt="Gradesnap logo"
            width={200}
            height={50}
          />
        </div>

        {/* Menu items */}
        <div className="flex flex-col items-center gap-10 text-secondary-foreground">
          {menu.map(({ name, icon: Icon, href }) => {
            const isActive = pathname === href
            return (
              <Link href={href} key={name}>
                <div
                  className={cn(
                    // Base button styles:
                    'h-fit px-6 py-3 flex flex-col items-center gap-1 rounded-md transition-colors',
                    // Default state:
                    'text-white opacity-60 hover:opacity-100',
                    // Active state overrides:
                    isActive && 'bg-[#141A3F] text-primary opacity-100 rounded',
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-normal">{name}</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Bottom: user avatar */}
        <div className="flex flex-col gap-5  items-center justify-center">
          <div className="w-full mt-8">
            <AvatarSidebar />
          </div>
          <div>
            <Button
              variant={'ghost'}
              onClick={handleLogout}
              className="flex flex-row items-center justify-center gap-2"
            >
              <CiLogout className="w-5 h-5" /> Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
