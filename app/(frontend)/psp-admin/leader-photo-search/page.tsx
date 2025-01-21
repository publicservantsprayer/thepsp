import React from 'react'

import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { ImageResponse } from './image-results'

export default async function LeadersPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string; page?: string }>
}) {
  await mustGetCurrentAdmin()

  const { query, page = '1' } = await searchParams

  return <ImageResponse query={query} page={page} />
}
