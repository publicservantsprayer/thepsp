import React from 'react'

import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { ImageResponse } from '../image-results'
import { getCollectionGroupLeaderByPermaLink } from '@/lib/firebase/firestore'
import { ImgType } from '../perform-google-image-search'

export default async function LeadersPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ query: string; imgType: ImgType; page?: string }>
}) {
  await mustGetCurrentAdmin()

  const { page = '1', imgType } = await searchParams
  let { query } = await searchParams

  const { id } = await params
  const leader = await getCollectionGroupLeaderByPermaLink(id)

  if (!query) {
    query = `${leader.Title} ${leader.FirstName} ${leader.LastName}`
  }

  return (
    <ImageResponse
      leader={leader}
      query={query}
      page={page}
      imgType={imgType}
    />
  )
}
