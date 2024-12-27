'use client'

import React from 'react'

import { states } from '@/data/states'
import type { StateCode } from '@/lib/types'
import axios from 'axios'
import { makeValidStateCode } from '@/data/get-state-info'

interface Props {
  paramStateCode?: string
  cookieStateCode?: string
  fetchGeoLocation?: boolean
}

/**
 * Hook to get state information from the URL, cookie, or geolocation.
 *
 * Preforms geo location lookup if no state code is provided.
 */
export function useUSAStateWithoutContext({
  paramStateCode,
  cookieStateCode,
  fetchGeoLocation,
}: Props) {
  if (!paramStateCode && !cookieStateCode) {
    fetchGeoLocation = true
  }

  const { geoStateCode, lat, lng } = useGeoStateCode({
    fetchGeoLocation,
  })

  const stateCode = makeValidStateCode(
    paramStateCode || cookieStateCode || geoStateCode,
  )

  const lowerCaseStateCode = stateCode.toLowerCase()
  const homePath = `/states/${lowerCaseStateCode}`
  const stateName = states[stateCode]
  let facebookPage = `PSP${stateName.split(' ').join('')}`

  if (stateCode === 'AL') {
    facebookPage = `${stateName.split(' ').join('')}PSP`
  }

  const stateNameFromStateCode = (stateCode: StateCode) => states[stateCode]

  return {
    stateCode,
    lowerCaseStateCode,
    stateName,
    stateNameFromStateCode,
    states,
    homePath,
    facebookPage,
    paramStateCode,
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

const googleBrowserKey = 'AIzaSyBQkLQ1DJEtDczE179QNc7fF1UM6t0piqY'

const googleGeolocationUrl = (googleBrowserKey: string) =>
  `https://www.googleapis.com/geolocation/v1/geolocate?key=${googleBrowserKey}`

const googleGeocodeUrl = (lat: string, lng: string, googleBrowserKey: string) =>
  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=administrative_area_level_1&key=${googleBrowserKey}`

const useGeoStateCode = ({
  fetchGeoLocation,
}: { fetchGeoLocation?: boolean } = {}) => {
  const [geoStateCode, setGeoStateCode] = React.useState('')
  const [lat, setLat] = React.useState<string>('')
  const [lng, setLng] = React.useState<string>('')

  React.useEffect(() => {
    const getGeoCodeState = async () => {
      try {
        const geoLocation = await axios.post(
          googleGeolocationUrl(googleBrowserKey),
        )
        const { lng, lat } = geoLocation.data.location
        setLat(lat)
        setLng(lng)

        const geoCode = await axios.post(
          googleGeocodeUrl(lat, lng, googleBrowserKey),
        )

        const shortName =
          geoCode.data.results[0].address_components[0].short_name
        console.log('ran geocode', { shortName, lat, lng })

        return geoCode.data.results[0].address_components[0].short_name
      } catch (error) {
        console.error('Error getting State from GeoCode: ', error)
        return null
      }
    }

    if (fetchGeoLocation) {
      setTimeout(() => {
        getGeoCodeState().then((stateCode) => {
          setGeoStateCode(stateCode)
        })
      }, 0)
    }
  }, [fetchGeoLocation])

  return { geoStateCode, lat, lng }
}
