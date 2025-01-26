import React from 'react'

import { notFound } from 'next/navigation'
import type { Post, PostLeader, StateCode } from '@/lib/types'
import { SiFacebook, SiX } from 'react-icons/si'
import { MdEmail } from 'react-icons/md'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import moment from 'moment'
import { getHistoricalPost, getLatestPost } from '@/lib/firebase/firestore'
import { Link } from '@/components/ui/link'
import Image from 'next/image'
import { leaderPhoto } from '@/lib/leader'
import { LeaderAccordion } from './accordion'
import { Separator } from '@/components/ui/separator'
import { getStateInfo } from '@/lib/get-state-info'

interface Props {
  stateCode: StateCode
  year?: number
  month?: number
  day?: number
}

export async function DailyLeaders({ stateCode, year, month, day }: Props) {
  let post: Post

  if (year && month && day) {
    const date = moment(`${year}-${month}-${day}`)
    if (!date.isValid()) {
      return notFound()
    }
    post = await getHistoricalPost(stateCode, date.format('YYYY-MM-DD'))
  } else {
    post = await getLatestPost(stateCode)
  }

  return (
    <div className="mx-auto mb-12 w-full max-w-[900px]">
      <Tabs defaultValue="today" className="grid grid-cols-1 gap-2">
        <TabsList className="grid w-full grid-cols-4 rounded-t-lg bg-accent text-accent-foreground">
          <TabsTrigger
            value="today"
            className="gap-2 data-[state=active]:text-accent-foreground"
          >
            Today
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="gap-2 data-[state=active]:text-accent-foreground"
            disabled={true}
          >
            <MdEmail /> Email
          </TabsTrigger>
          <TabsTrigger
            value="facebook"
            className="h-8 gap-2 data-[state=active]:text-accent-foreground"
            disabled={true}
          >
            <SiFacebook />
          </TabsTrigger>
          <TabsTrigger
            value="x"
            className="h-8 gap-2 data-[state=active]:text-accent-foreground"
            disabled={true}
          >
            <SiX />
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 gap-y-4 rounded-lg bg-background sm:grid-cols-10">
          <div className="rounded-lg border border-card sm:col-span-6 sm:rounded-l-lg sm:rounded-r-none">
            <div className="mx-2 rounded p-2 md:p-8">
              <TabsContent value="today" className="grid gap-4">
                <div className="mb-0 text-center">
                  {moment(post.dateID).format('dddd, MMMM Do')}
                </div>

                <PrayingForTitle dateID={post.dateID} />

                <div className="flex justify-around">
                  <LeaderPhoto leader={post.leader1} />
                  <LeaderPhoto leader={post.leader2} />
                  <LeaderPhoto leader={post.leader3} />
                </div>

                <div className="my-2">
                  <LeaderAccordion post={post} />
                </div>
              </TabsContent>
            </div>
          </div>

          <div className="col-span-4 rounded-lg bg-card p-2 text-card-foreground sm:rounded-l-none sm:rounded-r-lg">
            <StateMessage stateCode={stateCode} />
          </div>
        </div>
      </Tabs>
    </div>
  )
}

function LeaderPhoto({ leader }: { leader: PostLeader }) {
  if (!leader) return null

  return (
    <div className="m-1 h-[148px] w-full max-w-[108px]">
      <Link href={`/leader/${leader.permaLink}`}>
        <Image
          height={148}
          width={108}
          src={leaderPhoto(leader)}
          alt="Leader"
          className="rounded-lg"
        />
      </Link>
    </div>
  )
}

function PrayingForTitle({ dateID }: { dateID: string }) {
  const today = moment().isSame(moment(dateID), 'day')

  return (
    <div className="text-center text-2xl text-psp-primary-foreground">
      {today && <>Today we are praying for</>}
      {!today && <>This day we prayed for</>}
    </div>
  )
}

export function StateMessage({ stateCode }: { stateCode: StateCode }) {
  const { stateName } = getStateInfo(stateCode)

  return (
    <div className="grid gap-3 p-4 font-light leading-relaxed text-muted-foreground">
      <h2 className="text-2xl">PSP {stateName}</h2>

      <Separator className="bg-muted-foreground" />

      <p>
        Every day we pray for three {stateName}{' '}
        <Link
          href={`/states/${stateCode.toLowerCase()}/leaders`}
          className="underline"
        >
          legislators
        </Link>{' '}
        on both the state and federal level.
      </p>

      <p>
        To help facilitate this movement, we send a post out each morning on
        these networks:
      </p>

      <TabsList className="grid grid-cols-3">
        <TabsTrigger
          value="email"
          className="gap-2 data-[state=active]:bg-transparent"
          disabled={true}
        >
          <MdEmail /> Email
        </TabsTrigger>
        <TabsTrigger
          value="facebook"
          className="gap-2 data-[state=active]:bg-transparent"
          disabled={true}
        >
          <SiFacebook />
        </TabsTrigger>
        <TabsTrigger
          value="x"
          className="gap-2 data-[state=active]:bg-transparent"
          disabled={true}
        >
          <SiX />
        </TabsTrigger>
      </TabsList>

      <p>
        If {stateName} is not your state, first{' '}
        <Link href="/find-your-state" className="underline">
          find your state
        </Link>{' '}
        and then follow on X, Facebook, or get on the mailing list.
      </p>

      <p>
        You can join thousands in every state who are praying for their specific
        state leaders each day.
      </p>
    </div>
  )
}
