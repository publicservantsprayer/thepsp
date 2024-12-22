'use client'

import * as React from 'react'

import { useRouter } from 'next/navigation'
import { useUSAStateWithoutContext } from '@/hooks/use-usa-state'

export function RedirectToState() {
  const router = useRouter()
  const { stateCode } = useUSAStateWithoutContext({
    fetchGeoLocation: true,
  })

  React.useEffect(() => {
    router.push(`/states/${stateCode.toLowerCase()}`)
  }, [router, stateCode])

  return null
}
