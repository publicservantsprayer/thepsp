import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PostCategory from './post-category'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const posts = await getPosts()

  return <PostCategory posts={posts} categoryName="Posts" />
}

export function generateMetadata(): Metadata {
  return {
    title: `Public Servants' Prayer Posts`,
  }
}

const getPosts = async () => {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return posts
}

export type Posts = Awaited<ReturnType<typeof getPosts>>
