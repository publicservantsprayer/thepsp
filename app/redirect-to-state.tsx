'use client'

import * as React from 'react'

import { useRouter } from 'next/navigation'
import { useUSAState } from '@/hooks/use-usa-state'

export function RedirectToState() {
  const router = useRouter()
  const { stateCode } = useUSAState({
    fetchGeoLocation: true,
  })

  React.useEffect(() => {
    router.push(`/states/${stateCode.toLowerCase()}`)
  }, [router, stateCode])

  return null
}
