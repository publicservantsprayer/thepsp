'use client'

import * as React from 'react'
import Cookies from 'js-cookie'
import { updateServerCookie } from '@/server-functions/update-server-cookie'

export function useCookie(
  name: string,
  defaultValue: string,
  initialServerValue?: string,
) {
  const [value, setValue] = React.useState<string>(() => {
    if (initialServerValue) {
      try {
        return JSON.parse(initialServerValue)
      } catch {
        return initialServerValue
      }
    }
    return defaultValue
  })
  const [mounted, setMounted] = React.useState(false)

  // Only run after initial render to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
    const savedValue = Cookies.get(name)
    if (savedValue) {
      try {
        // Try to parse the stored value
        setValue(JSON.parse(savedValue))
      } catch {
        // If parsing fails, use the raw string value
        setValue(savedValue)
      }
    }
  }, [name])

  // Update both client and server cookies when value changes
  React.useEffect(() => {
    if (mounted) {
      const stringValue =
        typeof value === 'string' ? value : JSON.stringify(value)

      // Update client-side cookie
      Cookies.set(name, stringValue, {
        expires: 365,
        path: '/',
      })

      // Update server-side cookie
      updateServerCookie(name, stringValue)
    }
  }, [value, mounted, name])

  return [value, setValue] as const
}
