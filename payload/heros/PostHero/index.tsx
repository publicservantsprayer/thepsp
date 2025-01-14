import { formatDateTime } from '@/payload/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { formatAuthors } from '@/payload/utilities/formatAuthors'
import { ImageMedia } from './image-media'
import { cn } from '@/lib/utils'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, populatedAuthors, publishedAt, title } = post
  const heroImage = getHeroImage(post)

  const hasAuthors =
    populatedAuthors &&
    populatedAuthors.length > 0 &&
    formatAuthors(populatedAuthors) !== ''

  return (
    <div
      className={cn('relative flex items-end', heroImage && 'aspect-[16/9]')}
    >
      <div className="z-10 pb-8 text-white lg:grid lg:grid-cols-[1fr_48rem_1fr]">
        <div className="container col-span-1 col-start-1 md:col-span-2 md:col-start-2">
          <div className="mb-6 text-sm uppercase">
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const { title: categoryTitle } = category

                const titleToUse = categoryTitle || 'Untitled category'

                const isLast = index === categories.length - 1

                return (
                  <React.Fragment key={index}>
                    {titleToUse}
                    {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                  </React.Fragment>
                )
              }
              return null
            })}
          </div>

          <div className="">
            <h1 className="mb-6 text-3xl [text-shadow:_0_1px_0_var(--background)] md:text-5xl lg:text-6xl">
              {title}
            </h1>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:gap-16">
            {hasAuthors && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Author</p>

                  <p>{formatAuthors(populatedAuthors)}</p>
                </div>
              </div>
            )}
            {publishedAt && (
              <div className="flex flex-col gap-1">
                <p className="text-sm">Date Published</p>

                <time dateTime={publishedAt}>
                  {formatDateTime(publishedAt)}
                </time>
              </div>
            )}
          </div>
        </div>
      </div>
      {heroImage && (
        <div className="select-none">
          <ImageMedia
            fill
            priority
            imgClassName="-z-10 object-cover"
            resource={heroImage}
            uploadSize="hero"
          />
          <div className="pointer-events-none absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-black to-transparent" />
        </div>
      )}
    </div>
  )
}

const getHeroImage = (post: Post) => {
  return (
    postHeroImage(post) ||
    heroImageFromContent(post) ||
    firstImageFromContent(post)
  )
}

const postHeroImage = (post: Post) => {
  if (typeof post.heroImage === 'object' && post.heroImage?.sizes?.hero?.url) {
    return post.heroImage
  }
  if (typeof post.heroImage === 'object' && post.heroImage?.url) {
    return post.heroImage
  }
}

const heroImageFromContent = (post: Post) => {
  const contentChildren = post.content.root.children

  const mediaBlocks = findMediaBlocks(contentChildren)

  const heroMediaBlock = mediaBlocks.find(
    (block) => block.fields?.media?.sizes?.hero?.url,
  )

  return heroMediaBlock?.fields?.media
}

const firstImageFromContent = (post: Post) => {
  const contentChildren = post.content.root.children

  const mediaBlocks = findMediaBlocks(contentChildren)

  const firstMediaBlockWithImage = mediaBlocks.find(
    (block) => block.fields?.media?.url,
  )

  return firstMediaBlockWithImage?.fields?.media
}

const findMediaBlocks = (children: any[]): any[] => {
  let mediaBlocks: any[] = []

  children.forEach((child) => {
    if (child.fields?.blockType === 'mediaBlock' && child.fields?.media) {
      mediaBlocks.push(child)
    }
    if (child.children && Array.isArray(child.children)) {
      mediaBlocks = mediaBlocks.concat(findMediaBlocks(child.children))
    }
  })

  return mediaBlocks
}
