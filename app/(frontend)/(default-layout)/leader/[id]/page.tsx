import React from 'react'

import { LeaderProfile } from './leader-profile'
import { getCollectionGroupLeaderByPermaLink } from '@/lib/firebase/firestore'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function Leader({ params }: Props) {
  const { id } = await params

  const leader = await getCollectionGroupLeaderByPermaLink(id)

  return (
    <div className="flex-grow justify-center text-center">
      {leader && <LeaderProfile leader={leader} />}
    </div>
  )
}
