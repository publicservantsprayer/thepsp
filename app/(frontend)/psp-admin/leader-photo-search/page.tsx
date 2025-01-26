import React from 'react'

import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { ImageResponse } from './image-results'
import { ImgType } from './perform-google-image-search';

export default async function LeadersPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string; imgType: ImgType, page?: string }>
}) {
  await mustGetCurrentAdmin()

  const { query, imgType, page = '1' } = await searchParams

  return <ImageResponse query={query} page={page} imgType={imgType} />
}
