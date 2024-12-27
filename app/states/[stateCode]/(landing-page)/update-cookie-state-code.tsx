'use client'

import {
  makeValidStateCode,
  validateStateCode,
} from '@/data/make-valid-state-code'
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
