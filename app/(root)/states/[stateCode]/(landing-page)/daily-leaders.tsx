import React from 'react'

import { notFound } from 'next/navigation'
import type { Post, StateCode } from '@/lib/types'
import type { Leader } from '@/lib/types'

import { SiFacebook, SiX } from 'react-icons/si'
import { MdEmail } from 'react-icons/md'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import moment from 'moment'
import { getHistoricalPost, getLatestPost } from '@/lib/firebase/firestore'
import { Link } from '@/components/ui/link'
import Image from 'next/image'
import { leaderPhoto } from '@/lib/leader'
import { Skeleton } from '@mui/material'
import { Accordion } from './accordion'
import { Separator } from '@/components/ui/separator'
import { getStateInfo } from '@/data/get-state-info'

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

  const { stateName } = getStateInfo(stateCode)

  return (
    <div className="width-full mx-auto mb-12 max-w-[900px]">
      <Tabs defaultValue="today" className="grid gap-2">
        <TabsList className="bg-psp-primary grid w-full grid-cols-4 rounded-t-lg text-accent-foreground">
          <TabsTrigger
            value="today"
            className="data-[state=active]:text-psp-primary-foreground gap-2"
          >
            Today
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="data-[state=active]:text-psp-primary-foreground gap-2"
          >
            <MdEmail /> Email
          </TabsTrigger>
          <TabsTrigger
            value="facebook"
            className="data-[state=active]:text-psp-primary-foreground h-8 gap-2"
          >
            <SiFacebook />
          </TabsTrigger>
          <TabsTrigger
            value="x"
            className="data-[state=active]:text-psp-primary-foreground h-8 gap-2"
          >
            <SiX />
          </TabsTrigger>
        </TabsList>

        <div className="grid rounded-lg bg-background md:grid-cols-10">
          <div className="flex md:col-span-6">
            <div className="mx-2 flex-grow rounded p-8">
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
                  <Accordion leader={post.leader1} />
                  <Accordion leader={post.leader2} />
                  <Accordion leader={post.leader3} />
                </div>
              </TabsContent>
            </div>
          </div>

          <div className="col-span-4 rounded-r-lg bg-secondary p-2 text-secondary-foreground">
            <StateMessage stateName={stateName} />
          </div>
        </div>
      </Tabs>
    </div>
  )
}

function LeaderPhoto({ leader }: { leader: Leader }) {
  return (
    <div className="m-1 h-[148px] w-full max-w-[108px]">
      <Link href={`/leader/${leader.permaLink}`}>
        {!leader.PID ? (
          <Skeleton height={148} width={108} />
        ) : (
          <Image
            height={148}
            width={108}
            src={leaderPhoto(leader)}
            alt="Leader"
            className="rounded-lg"
          />
        )}
      </Link>
    </div>
  )
}

function PrayingForTitle({ dateID }: { dateID: string }) {
  const today = moment().isSame(moment(dateID), 'day')

  return (
    <div className="text-psp-primary-foreground text-center text-2xl">
      {today && <>Today we are praying for</>}
      {!today && <>This day we prayed for</>}
    </div>
  )
}

export function StateMessage({ stateName }: { stateName: string }) {
  return (
    <div className="grid gap-3 p-4 font-light leading-relaxed text-muted-foreground">
      <h2 className="text-2xl">PSP {stateName}</h2>

      <Separator className="bg-muted-foreground" />

      <p>
        Every day we pray for three {stateName}{' '}
        <Link
          href={`/states/${stateName.toLowerCase()}/leaders`}
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
        >
          <MdEmail /> Email
        </TabsTrigger>
        <TabsTrigger
          value="facebook"
          className="gap-2 data-[state=active]:bg-transparent"
        >
          <SiFacebook />
        </TabsTrigger>
        <TabsTrigger
          value="x"
          className="gap-2 data-[state=active]:bg-transparent"
        >
          <SiX />
        </TabsTrigger>
      </TabsList>

      <p>
        If {stateName} is not your state, first{' '}
        <Link href="/find-your-state" className="underline">
          find your state
        </Link>{' '}
        and then follow on Facebook, or get on the mailing list.
      </p>

      <p>
        You can join thousands in every state who are praying for their specific
        state leaders each day.
      </p>
    </div>
  )
}