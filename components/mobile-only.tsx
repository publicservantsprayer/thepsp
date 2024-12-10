'use client'

import { useMobile } from '@/hooks/use-mobile'

export default function MobileOnly({
  children,
}: {
  children: React.ReactNode
}) {
  const mobile = useMobile()

  return mobile ? children : null
}
