import React from 'react'

import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { getCollectionGroupLeaderByPermaLink } from '@/lib/firebase/firestore'
import { ImageEditor } from './image-editor'

export default async function LeaderPhotoEditPage({
  params,
}: {
  params: Promise<{ permaLink: string }>
}) {
  await mustGetCurrentAdmin()

  const { permaLink } = await params
  const leader = await getCollectionGroupLeaderByPermaLink(permaLink)

  return <ImageEditor leader={leader} />
}
