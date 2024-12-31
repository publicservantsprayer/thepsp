'use client'

import React from 'react'

import { states } from '@/data/states'
import type { StateCode } from '@/lib/types'
import {
  getStateCodeFromClientCookie,
  getStateInfo,
  makeValidStateCode,
} from '@/lib/get-state-info'
import { useGeoStateCode } from './use-geo-state-code'

interface Props {
  paramStateCode?: string
  cookieStateCode?: StateCode
  fetchGeoLocation?: boolean
}

/**
 * Hook to get state information from the URL, cookie, or geolocation.
 *
 * Preforms geo location lookup if no state code is provided or if fetchGeoLocation is true.
 */
export function useUSAStateWithoutContext({
  paramStateCode,
  cookieStateCode,
  fetchGeoLocation,
}: Props) {
  cookieStateCode ||= getStateCodeFromClientCookie()

  if (!paramStateCode && !cookieStateCode) {
    fetchGeoLocation = true
  }

  const skip = !fetchGeoLocation
  const { geoStateCode, lat, lng } = useGeoStateCode(skip)

  const stateCode = makeValidStateCode(
    paramStateCode || cookieStateCode || geoStateCode,
  )

  return {
    ...getStateInfo(stateCode),
    paramStateCode,
    cookieStateCode,
    geoStateCode,
    lat,
    lng,
  }
}

type UseUSAState = ReturnType<typeof useUSAStateWithoutContext> | undefined

export const USAStateContext = React.createContext<UseUSAState>(undefined)

type ProviderProps = Props & { children: React.ReactNode }

export const UsaStateProvider = ({ children, ...props }: ProviderProps) => {
  const usaState = useUSAStateWithoutContext(props)
  return (
    <USAStateContext.Provider value={usaState}>
      {children}
    </USAStateContext.Provider>
  )
}

export const useUSAState = () => {
  const context = React.useContext(USAStateContext)
  if (!context) {
    throw new Error('useUSAState must be used within a UsaStateProvider')
  }

  return context
}
