'use client'

import { useUSAStateWithoutContext } from '@/hooks/use-usa-state'

export default function DetectPage() {
  const {
    stateCode,
    lowerCaseStateCode,
    stateName,
    facebookPage,
    geoStateCode,
    cookieStateCode,
    lat,
    lng,
  } = useUSAStateWithoutContext({ fetchGeoLocation: true })

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl">State Detection</h1>

      <div className="prose">
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
    </div>
  )
}
