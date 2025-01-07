import { getCachedGlobal } from '@/payload/utilities/getGlobals'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/payload/providers/Theme/ThemeSelector'
import { CMSLink } from '@/payload/components/Link'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-black text-muted-foreground">
      <div className="container flex flex-col gap-8 py-8 md:flex-row md:justify-between">
        <Link className="flex items-center" href="/">
          <Image
            className="h-auto w-64"
            width={1500}
            height={351}
            src="/images/public-servants-prayer.png"
            alt="Public Servants' Prayer"
          />
        </Link>

        <div className="flex flex-col-reverse items-start gap-4 md:flex-row md:items-center">
          <ThemeSelector />
          <nav className="flex flex-col gap-4 md:flex-row">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
