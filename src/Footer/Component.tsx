import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import ImageComponent from '@/components/Media/ImageComponent'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="w-full border-border bg-secondary dark:bg-card text-white ">
      <div className="w-3/4 mx-auto py-10 gap-5 flex flex-col md:flex-row md:justify-between ">
        <div className="w-fit flex flex-col items-center justify-center">
          <Link className="flex items-center w-fit" href="/">
            <ImageComponent
              className="w-full "
              alt="logo"
              image={'/logos/logo-darkbackground.svg'}
            />
          </Link>
        </div>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
