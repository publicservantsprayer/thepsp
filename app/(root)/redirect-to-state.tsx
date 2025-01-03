'use client'

import * as React from 'react'

import { useRouter } from 'next/navigation'
import { useUSAState } from '@/hooks/use-usa-state'
import { defaultStateCode } from '@/data/states'

export function RedirectToState() {
  const router = useRouter()
  const { stateCode } = useUSAState()

  const lowerCaseStateCode = stateCode
    ? stateCode.toLowerCase()
    : defaultStateCode.toLowerCase()

  React.useEffect(() => {
    router.push(`/states/${lowerCaseStateCode}`)
  }, [router, stateCode, lowerCaseStateCode])

  return null
}
