'use client'

import { cn } from '@/lib/utils'
import React from 'react'

export function Nav({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
}) {
  // const [isScrollingUp, setIsScrollingUp] = React.useState(false)

  // React.useEffect(() => {
  //   let lastScrollTop = 0
  //   const handleScroll = () => {
  //     const scrollTop = window.scrollY || document.documentElement.scrollTop
  //     if (scrollTop > lastScrollTop) {
  //       setIsScrollingUp(true)
  //     } else {
  //       setIsScrollingUp(false)
  //     }
  //     lastScrollTop = scrollTop <= 0 ? 0 : scrollTop // For Mobile or negative scrolling
  //   }

  //   window.addEventListener('scroll', handleScroll)
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll)
  //   }
  // }, [])

  return (
    <nav
      className={cn(
        // 'data-[transparent=false]:to-background data-[transparent=true]:to-background/80',
        className,
      )}
      // data-transparent={isScrollingUp}
      {...props}
    >
      {children}
    </nav>
  )
}
