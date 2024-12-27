import React from 'react'

// import { useHistoricalPost, useLatestPost } from '@/lib/firebase/firestore'
// import TabPanels from './TabPanels'
import { notFound } from 'next/navigation'
import { StateMessage } from './state-message'
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
import { Skeleton, Typography } from '@mui/material'
import { Accordion } from './accordion'

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
    <div className="width-full mx-auto mb-12 max-w-[900px]">
      <Tabs defaultValue="today" className="grid gap-1">
        {/* <div className="w-full gap-4 rounded-b-none rounded-t-lg bg-primary text-primary-foreground"> */}
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
            className="data-[state=active]:text-psp-primary-foreground gap-2"
          >
            <SiFacebook />
          </TabsTrigger>
          <TabsTrigger
            value="x"
            className="data-[state=active]:text-psp-primary-foreground gap-2"
          >
            <SiX />
          </TabsTrigger>
        </TabsList>
        {/* </div> */}

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
            <StateMessage />
          </div>
        </div>
      </Tabs>
    </div>
  )
}

// const fakePost = {
//   leader1: {},
//   leader2: {},
//   leader3: {},
// }

// const HistoricalDailyLeaders = () => {
//   const { year, month, day } = useParams()
//   let [post, loading] = useHistoricalPost(year, month, day)
//   post = loading ? fakePost : post

//   return <ActualDailyLeaders post={post} />
// }

// const LatestDailyLeaders = () => {
//   let [post, loading] = useLatestPost()
//   post = loading ? fakePost : post

//   return <ActualDailyLeaders post={post} />
// }

// export default function DailyLeaders() {
//   const { stateCode } = useUSAState()
//   const { year, month, day } = useParams()

//   if (!stateCode) return null

//   if (year && month && day) {
//     return <HistoricalDailyLeaders />
//   } else {
//     return <LatestDailyLeaders />
//   }
// }

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
