import React from 'react'

import axios from 'axios'

const googleBrowserKey = 'AIzaSyBQkLQ1DJEtDczE179QNc7fF1UM6t0piqY'

export const useGeoStateCode = (skip: boolean = true) => {
  const [geoStateCode, setGeoStateCode] = React.useState('')
  const [lat, setLat] = React.useState('')
  const [lng, setLng] = React.useState('')

  React.useEffect(() => {
    if (!skip) {
      const getGeoCodeState = async () => {
        try {
          const geoLocation = await axios.post(googleGeolocationUrl)
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

      setTimeout(() => {
        getGeoCodeState().then((stateCode) => {
          setGeoStateCode(stateCode)
        })
      }, 0)
    }
  }, [skip])

  return { geoStateCode, lat, lng }
}

const googleGeolocationUrl = `https://www.googleapis.com/geolocation/v1/geolocate?key=${googleBrowserKey}`

const googleGeocodeUrl = (lat: string, lng: string, googleBrowserKey: string) =>
  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=administrative_area_level_1&key=${googleBrowserKey}`
