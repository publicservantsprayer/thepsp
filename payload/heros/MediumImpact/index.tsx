import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/payload/components/Link'
import { Media } from '@/payload/components/Media'
import RichText from '@/payload/components/RichText'

export const MediumImpactHero: React.FC<Page['hero']> = ({
  links,
  media,
  richText,
}) => {
  return (
    <div className="">
      <div className="container mb-8">
        {richText && (
          <RichText className="mb-6" data={richText} enableGutter={false} />
        )}

        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex gap-4">
            {links.map(({ link }, i) => {
              return (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <div className="container">
        {media && typeof media === 'object' && (
          <div>
            <Media
              className="-mx-4 md:-mx-8 2xl:-mx-16"
              imgClassName=""
              priority
              resource={media}
            />
            {/* TODO: Fix this type */}
            {/* @ts-ignore */}
            {media?.caption && (
              <div className="mt-3">
                {/* @ts-ignore */}
                <RichText data={media.caption} enableGutter={false} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
