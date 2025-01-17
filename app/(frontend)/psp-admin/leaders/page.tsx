import React from 'react'

import { stateCodes } from '@/data/states'
import { getOrderedLeadersForDailyPost } from '@/lib/firebase/firestore'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { unstable_cache } from 'next/cache'

export default async function LeadersPage() {
  const stateLeaders = await unstable_cache(async () => {
    const stateLeadersObj = {} as Record<
      StateCode,
      { leader: Leader; daysAway: number }[]
    >

    await Promise.all(
      stateCodes.map(async (stateCode) => {
        const leaders = await getOrderedLeadersForDailyPost(stateCode)
        stateLeadersObj[stateCode] = leaders
          .map((leader, i) => {
            const daysAway = Math.ceil((i + 1) / 3)
            return {
              leader,
              daysAway,
            }
          })
          .filter((leader) => leader.leader.hasPhoto === false)
      }),
    )

    return stateLeadersObj
  })()

  return (
    <div className="container">
      <h1 className="mb-4 text-xl">Leaders</h1>

      <div className="grid grid-cols-[1fr_auto] gap-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {stateCodes.map((stateCode) => (
            <Card key={stateCode} className="xxxmax-h-72 bg-card/40">
              <CardHeader>
                <h2 className="my-2 text-sm">
                  {getStateInfo(stateCode).stateName}
                </h2>
              </CardHeader>

              <CardContent>
                <ScrollArea className="h-32">
                  <ul>
                    {stateLeaders[stateCode].map(({ leader, daysAway }) => (
                      <li key={leader.id} className="text-xs">
                        {leader.permaLink} - {daysAway} days away
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="max-w-xs">
          <CardHeader>
            <CardTitle>Check Leader Photos</CardTitle>
            <CardDescription>
              Check all current leaders for every state (regardless of the{' '}
              <span className="text-code">hasPhoto</span> value), to see if a
              photo actually exists. Update the{' '}
              <span className="text-code">hasPhoto</span> value in the database.
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
