'use client'

import { useUSAState } from '@/hooks/use-usa-state'

export function Detect() {
  // return null
  const {
    stateCode,
    lowerCaseStateCode,
    stateName,
    stateCodes,
    facebookPage,
    paramStateCode,
    cookieStateCode,
    geoStateCode,
    lat,
    lng,
  } = useUSAState({ fetchGeoLocation: true })

  return (
    <div>
      <ul>
        <li>State Code: {stateCode}</li>
        <li>Lower Case State Code: {lowerCaseStateCode}</li>
        <li>State Name: {stateName}</li>
        <li>State Codes: {stateCodes}</li>
        <li>Facebook Page: {facebookPage}</li>
        <li>Param State Code: {paramStateCode}</li>
        <li>Cookie State Code: {cookieStateCode}</li>
        <li>Geo State Code: {geoStateCode}</li>
        <li>Latitude: {lat}</li>
        <li>Longitude: {lng}</li>
      </ul>
    </div>
  )
}
