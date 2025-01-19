import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PostCategory from '../posts/post-category'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
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
    where: {
      'categories.path': {
        equals: 'articles',
      },
    },
  })

  return (
    <PostCategory
      posts={posts}
      categoryName="Articles"
      collectionLabels={{ plural: 'Articles', singular: 'Article' }}
    />
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Public Servants' Prayer Articles`,
  }
}
