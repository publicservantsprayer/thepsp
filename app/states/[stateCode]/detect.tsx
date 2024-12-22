'use client'

import { useUSAStateWithoutContext } from '@/hooks/use-usa-state'

export function Detect({ cookieStateCode }: { cookieStateCode?: string }) {
  const {
    stateCode,
    lowerCaseStateCode,
    stateName,
    facebookPage,
    geoStateCode,
    lat,
    lng,
  } = useUSAStateWithoutContext({ fetchGeoLocation: true })

  return (
    <div>
      <ul>
        <li>State Code: {stateCode}</li>
        <li>Lower Case State Code: {lowerCaseStateCode}</li>
        <li>State Name: {stateName}</li>
        <li>Facebook Page: {facebookPage}</li>
        <li>Cookie State Code: {cookieStateCode}</li>
        <li>Geo State Code: {geoStateCode}</li>
        <li>Latitude: {lat}</li>
        <li>Longitude: {lng}</li>
      </ul>
    </div>
  )
}
