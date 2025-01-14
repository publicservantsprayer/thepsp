'use client'
import { useHeaderTheme } from '@/payload/providers/HeaderTheme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/payload/components/Link'
import { Media } from '@/payload/components/Media'
import RichText from '@/payload/components/RichText'
import { cn } from '@/lib/utils'

export const HighImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  richText,
}) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  const hasHeroImage = media && typeof media === 'object'

  return (
    <div
      className={cn(
        'container relative flex w-screen items-end justify-center text-white',
        hasHeroImage && 'aspect-[16/9]',
      )}
      data-theme="dark"
    >
      <div className="container z-10 mb-8 flex justify-center">
        <div className="">
          {richText && (
            <RichText
              className="mb-6 ![text-shadow:_0_5px_0_var(--background)]"
              data={richText}
              enableGutter={false}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex gap-4 md:justify-center">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="select-none">
        {media && typeof media === 'object' && (
          <div className="select-none">
            <Media
              fill
              imgClassName="-z-10 object-cover"
              priority
              resource={media}
            />
            <div className="pointer-events-none absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-black via-transparent/70 to-90%" />
          </div>
        )}
      </div>
    </div>
  )
}
