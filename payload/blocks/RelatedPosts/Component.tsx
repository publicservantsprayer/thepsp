import clsx from 'clsx'
import React from 'react'
import RichText from '@/payload/components/RichText'

import type { Post } from '@/payload-types'

import { Card } from '../../components/Card'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  // TODO: Add type for introContent
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  introContent?: any
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props

  return (
    <div className={clsx('lg:container', className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-8">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return (
            <Card key={index} doc={doc} relationTo="posts" showCategories />
          )
        })}
      </div>
    </div>
  )
}
