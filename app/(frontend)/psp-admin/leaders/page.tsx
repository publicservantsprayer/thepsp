import React from 'react'

import { stateCodes } from '@/data/states'
import { getLeadersWithoutPhoto } from '@/lib/firebase/firestore'
import { Leader, StateCode } from '@/lib/types'
import { getStateInfo } from '@/lib/get-state-info'
import { CheckLeadersForPhotoButton } from './check-leader-images'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default async function LeadersPage() {
  const stateLeaders = {} as Record<StateCode, Leader[]>

  await Promise.all(
    stateCodes.map(async (stateCode) => {
      stateLeaders[stateCode] = await getLeadersWithoutPhoto(stateCode)
    }),
  )

  return (
    <div className="container">
      <h1 className="mb-4 text-xl">Leaders</h1>

      <div className="grid grid-cols-[1fr_auto] gap-4">
        <div>
          {stateCodes.map((stateCode) => (
            <div key={stateCode}>
              <h2 className="mb-1 mt-2 text-sm">
                {getStateInfo(stateCode).stateName}
              </h2>
              <ul>
                {stateLeaders[stateCode].map((leader) => (
                  <li key={leader.id} className="text-xs">
                    {leader.FirstName} {leader.LastName} {leader.PhotoFile}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Card className="max-w-xs">
          <CardHeader>
            <CardTitle>Check Leader Photos</CardTitle>
            <CardDescription>
              Check all current leaders for every state (regardless of the
              "hasPhoto" value), to see if a photo actually exists. Update the
              "hasPhoto" value in the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CheckLeadersForPhotoButton />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
