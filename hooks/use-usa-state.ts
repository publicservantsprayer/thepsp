'use client'

import React from 'react'
import { states, StateCode } from '@/data/states'
import axios from 'axios'
import { makeValidStateCode } from '@/data/make-valid-state-code'

interface Props {
  paramStateCode?: string
  cookieStateCode?: string
  fetchGeoLocation?: boolean
}

export function useUSAState({
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
    paramStateCode || cookieStateCode || geoStateCode
  )

  const lowerCaseStateCode = stateCode.toLowerCase()
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
    statesObj: states,
    facebookPage,
    paramStateCode,
    geoStateCode,
    lat,
    lng,
  }
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
          googleGeolocationUrl(googleBrowserKey)
        )
        const { lng, lat } = geoLocation.data.location
        setLat(lat)
        setLng(lng)

        const geoCode = await axios.post(
          googleGeocodeUrl(lat, lng, googleBrowserKey)
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
