'use client'

import * as React from 'react'

import { useHomePath } from '@/hooks/use-home-path'
import { useRouter } from 'next/navigation'

export function RedirectToState() {
  const homePath = useHomePath()
  const router = useRouter()
  console.log({ homePath })

  React.useEffect(() => {
    router.push(homePath)
  }, [homePath, router])

  return null
}
