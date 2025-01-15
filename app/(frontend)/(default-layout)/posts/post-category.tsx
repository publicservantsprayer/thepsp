import { CollectionArchive } from '@/payload/components/CollectionArchive'
import { PageRange } from '@/payload/components/PageRange'
import { Pagination } from '@/payload/components/Pagination'
import React from 'react'
import PageClient from './page.client'
import { Posts } from './page'

export const dynamic = 'force-static'
export const revalidate = 600

interface Props {
  posts: Posts
  categoryName: string
}
export default async function PostCategory({ posts, categoryName }: Props) {
  return (
    <div className="pb-24 pt-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose max-w-none dark:prose-invert">
          <h1>{categoryName}</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}
