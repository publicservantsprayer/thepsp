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
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function LeadersPage() {
  await mustGetCurrentAdmin()

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

  const getLink = (leader: Leader) => {
    const urlSearchParams = new URLSearchParams()
    urlSearchParams.set(
      'query',
      `${leader.Title} ${leader.FirstName} ${leader.LastName}`,
    )
    return `/psp-admin/leader-photo-search/${leader.permaLink}?${urlSearchParams.toString()}`
  }

  return (
    <div className="container">
      <h1 className="mb-4 text-xl">Leaders Without Photos</h1>

      <div className="grid grid-cols-[1fr_auto] gap-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {stateCodes.map((stateCode) => (
            <Card key={stateCode} className="bg-card/40">
              <CardHeader className="pb-1">
                <CardTitle className="text-base">
                  {getStateInfo(stateCode).stateName}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <ScrollArea className="h-32">
                  <ul>
                    {stateLeaders[stateCode]?.map(({ leader, daysAway }) => (
                      <li
                        key={leader.ref.id}
                        className={cn('flex flex-row justify-between text-sm', [
                          daysAway < 4 && 'text-red-600',
                          daysAway > 3 && daysAway < 8 && 'text-yellow-500',
                        ])}
                      >
                        <Link
                          href={getLink(leader)}
                          className="hover:underline"
                        >
                          {leader.LastName}
                        </Link>
                        <div>{daysAway} days away</div>
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
