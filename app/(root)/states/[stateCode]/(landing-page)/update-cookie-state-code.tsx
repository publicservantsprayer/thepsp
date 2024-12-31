'use client'

import { makeValidStateCode, validateStateCode } from '@/lib/get-state-info'
import { updateCookieStateCode } from '@/server-functions/update-cookie-state-code'
import React from 'react'

export function UpdateCookieStateCode({
  paramStateCode,
}: {
  paramStateCode: string
}) {
  React.useEffect(() => {
    const upperStateCode = paramStateCode.toUpperCase()
    if (validateStateCode(upperStateCode)) {
      const stateCode = makeValidStateCode(upperStateCode)
      updateCookieStateCode(stateCode)
    }
  }, [paramStateCode])

  return null
}
