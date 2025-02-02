import React from 'react'

import { stateCodes } from '@/data/states'
import {
  getOrderedLeadersForDailyPost,
  getRecentlyUpdatedLeaders,
  getStates,
} from '@/lib/firebase/firestore'
import { Leader, StateCode } from '@/lib/types'
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
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { LeaderCardDialog } from '@/components/psp-admin/leader-card-dialog'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

export default async function LeadersPage() {
  await mustGetCurrentAdmin()

  const states = await getStates()

  const recentlyUpdatedLeaders = await getRecentlyUpdatedLeaders({
    limit: 10,
  })

  const getStateLeadersObj = async () => {
    const stateLeaderPromises = stateCodes.map(async (stateCode) => {
      const leaders = await getOrderedLeadersForDailyPost(stateCode)
      const stateLeaders = leaders
        .map((leader, i) => {
          const daysAway = Math.ceil((i + 1) / 3)
          return {
            stateCode,
            leader,
            daysAway,
          }
        })
        .filter((leader) => leader.leader.hasPhoto === false)
      return stateLeaders
    })

    const stateLeadersObj = {} as Record<
      StateCode,
      { leader: Leader; daysAway: number }[]
    >
    const stateLeaders = await Promise.all(stateLeaderPromises)

    stateLeaders.forEach((leaders) => {
      leaders.forEach((stateLeader) => {
        if (!stateLeadersObj[stateLeader.stateCode]) {
          stateLeadersObj[stateLeader.stateCode] = []
        }
        stateLeadersObj[stateLeader.stateCode].push({
          leader: stateLeader.leader,
          daysAway: stateLeader.daysAway,
        })
      })
    })

    return stateLeadersObj
  }

  const getCachedStateLeaderObj = unstable_cache(
    getStateLeadersObj,
    ['stateLeaders'],
    {
      revalidate: 60 * 60 * 1, // in seconds
      tags: ['stateLeadersWithoutPhotos'],
    },
  )

  const stateLeaders = await getCachedStateLeaderObj()

  return (
    <div className="container">
      <h1 className="mb-4 text-xl">Leaders Without Photos</h1>

      <div className="grid grid-cols-[1fr_auto] gap-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {states.map((state) => (
            <Card key={state.ref.id} className="bg-card/40">
              <CardHeader className="pb-1">
                <CardTitle className="text-base">{state.name}</CardTitle>
              </CardHeader>

              <ScrollArea className="my-1 mr-1 h-32">
                <CardContent>
                  <ul>
                    {stateLeaders[state.ref.id]?.map(({ leader, daysAway }) => (
                      <li
                        key={leader.ref.id}
                        className={cn('flex flex-row justify-between text-sm', [
                          daysAway < 4 && 'text-red-600',
                          daysAway > 3 && daysAway < 8 && 'text-yellow-500',
                        ])}
                      >
                        <LeaderCardDialog leader={leader} state={state}>
                          {leader.fullname}
                        </LeaderCardDialog>
                        <div>{daysAway} days away</div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </ScrollArea>
            </Card>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <Card className="max-w-xs">
            <CardHeader>
              <CardTitle>Check Leader Photos</CardTitle>
              <CardDescription>
                Check all current leaders for every state (regardless of the{' '}
                <span className="text-code">hasPhoto</span> value), to see if a
                photo actually exists. Update the{' '}
                <span className="text-code">hasPhoto</span> value in the
                database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CheckLeadersForPhotoButton />
            </CardContent>
          </Card>
          <Card className="max-w-xs">
            <CardHeader>
              <CardTitle>Recently Updated</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 text-sm">
                {recentlyUpdatedLeaders.map((leader) => (
                  <React.Fragment key={leader.ref.id}>
                    <div>
                      <LeaderCardDialog leader={leader}>
                        {leader.fullname}
                      </LeaderCardDialog>
                    </div>
                    <div>{leader.StateCode}</div>
                    <div>
                      {leader.updatedAt &&
                        formatDistanceToNow(leader.updatedAt, {
                          addSuffix: true,
                        })}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
