import React from 'react'
import RichText from '@/payload/components/RichText'

import type { SimpleContentBlock as SimpleContentBlockProps } from '@/payload-types'
export const SimpleContentBlock: React.FC<SimpleContentBlockProps> = ({
  richText,
}) => {
  return (
    <div className="container">
      {richText && (
        <RichText
          className="mx-auto max-w-[48rem]"
          data={richText}
          enableGutter={false}
        />
      )}
    </div>
  )
}
