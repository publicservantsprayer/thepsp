import React from 'react'

import { LeaderProfile } from './leader-profile'
import { getLeader } from '@/lib/firebase/firestore'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function Leader({ params }: Props) {
  const { id } = await params

  const leader = await getLeader(id)

  return (
    <div className="flex-grow text-center justify-center">
      {leader && <LeaderProfile leader={leader} />}
    </div>
  )
}
