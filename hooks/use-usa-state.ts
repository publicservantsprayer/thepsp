'use client'

import React from 'react'
import { states, StateCode } from '@/data/states'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { useParams } from 'next/navigation'

export function useUSAState({
  fetchGeoLocation,
}: { fetchGeoLocation?: boolean } = {}) {
  const { paramStateCode, cookieStateCode, geoStateCode, lat, lng } =
    useStateCode({
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
    stateCodes,
    statesObj: states,
    facebookPage,
    paramStateCode,
    cookieStateCode,
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

// Uppercase, two-letter state codes
const stateCodes = Object.keys(states)
const fallBackStateCode: StateCode = 'TX'

const validateStateCode = (stateCode?: string) => {
  return stateCode && stateCode.length === 2 && stateCodes.includes(stateCode)
}

const makeValidStateCode = (stateCode?: string) => {
  stateCode = stateCode?.toUpperCase()
  if (validateStateCode(stateCode)) return stateCode as StateCode
  else return fallBackStateCode as StateCode
}

const useStateCode = ({
  fetchGeoLocation,
}: { fetchGeoLocation?: boolean } = {}) => {
  const [cookies, setCookie] = useCookies(['stateCode'])
  const params = useParams<{ stateCode: string }>()
  const [geoStateCode, setGeoStateCode] = React.useState('')
  const [lat, setLat] = React.useState<string>('')
  const [lng, setLng] = React.useState<string>('')

  const cookieStateCode = cookies.stateCode?.toUpperCase()
  const paramStateCode = params.stateCode?.toUpperCase()

  const setStateCodeToCookie = (stateCode: string) => {
    setCookie('stateCode', stateCode.toUpperCase(), { path: '/' })
  }

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

    // if (fetchGeoLocation || !cookieStateCode || !paramStateCode) {
    //   setTimeout(() => {
    //     getGeoCodeState().then((stateCode) => {
    //       setGeoStateCode(stateCode)
    //     })
    //   }, 0)
    // }
  }, [cookieStateCode, fetchGeoLocation, paramStateCode])

  return { cookieStateCode, paramStateCode, geoStateCode, lat, lng }
}
