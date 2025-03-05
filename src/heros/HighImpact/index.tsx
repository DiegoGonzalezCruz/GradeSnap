'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

// import { CMSLink } from '@/components/Link'
// import { Media } from '@/components/Media'
// import RichText from '@/components/RichText'
// import ImageComponent from '@/components/Media/ImageComponent'
import LoginComponent from '@/app/(frontend)/(login)/login/LoginComponent'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return <LoginComponent />
}
