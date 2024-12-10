'use client'

import { useDesktop } from '@/hooks/use-desktop'

export default function DesktopOnly({
  children,
}: {
  children: React.ReactNode
}) {
  const desktop = useDesktop()

  return desktop ? children : null
}
