'use client'

import { useUSAStateWithoutContext } from '@/hooks/use-usa-state'

export default function DetectPage() {
  const { geoStateCode, cookieStateCode, lat, lng } = useUSAStateWithoutContext(
    { fetchGeoLocation: true },
  )

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl">State Detection</h1>

      <div className="prose dark:prose-invert">
        <ul>
          <li>Geo State Code: {geoStateCode}</li>
          <li>Latitude: {lat}</li>
          <li>Longitude: {lng}</li>
          <li>Cookie State Code: {cookieStateCode}</li>
        </ul>
      </div>
    </div>
  )
}
