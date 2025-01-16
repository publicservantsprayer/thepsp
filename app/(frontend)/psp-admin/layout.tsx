import React from 'react'

import { Button } from '@/components/ui/button'
import { checkLeadersForPhoto } from '@/server-functions/check-leaders-for-photo'
import { NavBar } from '@/components/nav-bar'
import Footer from '@/components/footer'

interface Props {
  children: React.ReactNode
}

export default function DefaultLayout({ children }: Props) {
  return (
    <>
      <NavBar />
      <div className="mb-16 flex flex-col items-center gap-4 pt-8 font-lato">
        {children}
      </div>
      <Footer />
    </>
  )
}
