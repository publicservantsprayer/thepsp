import React from 'react'
import Container from '@mui/material-pigment-css/Container'

import { useMobile } from '@/hooks/use-mobile'

export function DesktopContainer({
  children,
  maxWidth,
}: {
  children: React.ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}) {
  const mobile = useMobile()

  if (mobile) return children

  return <Container maxWidth={maxWidth}>{children}</Container>
}
