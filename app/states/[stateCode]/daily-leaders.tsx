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
    <div className="m-auto width-full max-w-[900px]">
      <Tabs defaultValue="today">
        <div className="">
          <TabsList className="gap-4 w-full bg-primary text-primary-foreground h-14 rounded-t-lg rounded-b-none">
            <TabsTrigger value="today">TODAY</TabsTrigger>
            <TabsTrigger value="email">
              <MdEmail />
            </TabsTrigger>
            <TabsTrigger value="facebook">
              <SiFacebook />
            </TabsTrigger>
            <TabsTrigger value="x">
              <SiX />
            </TabsTrigger>
          </TabsList>

          <div className="grid md:grid-cols-2">
            <div className="flex">
              <div className="p-2 mx-2 rounded flex-grow">
                <TabsContent value="today">
                  <div className="mb-1 text-center">
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

            <div className="p-2 bg-secondary text-secondary-foreground">
              <StateMessage />
            </div>
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
    <div className="h-[148px] w-full max-w-[108px] m-1">
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
    <div className="my-2 font-bold text-center">
      <Typography variant="h5" color="secondary">
        {today && <>Today we are praying for</>}
        {!today && <>This day we prayed for</>}
      </Typography>
    </div>
  )
}
