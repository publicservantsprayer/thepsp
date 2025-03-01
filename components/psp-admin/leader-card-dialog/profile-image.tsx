/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import missingPhoto from '@/public/images/no-image.jpg'
import Link from 'next/link'
import { useLeaderData, usePhotoRefresh } from './use-leader-data'

export function ProfileImage() {
  const { leader } = useLeaderData()
  const { refreshTimestamp } = usePhotoRefresh()
  const [imageTimestamp, setImageTimestamp] = React.useState(Date.now())

  // Update timestamp when leader data changes or when refresh is triggered
  React.useEffect(() => {
    setImageTimestamp(Date.now())
  }, [leader.PhotoFile, leader.photoUploadCropped, refreshTimestamp])

  const thumbnailUrl = leader.hasPhoto
    ? `/images/leader-photo/thumbnail/${leader.PhotoFile}?t=${imageTimestamp}`
    : missingPhoto.src

  return (
    <div className="absolute right-10 top-4 z-10 m-4">
      <Link href={thumbnailUrl} target="_blank">
        <img
          src={thumbnailUrl}
          alt="Thumbnail"
          className="h-[148px] w-[108px] rounded-lg border border-muted-foreground"
          onError={(e) => {
            e.currentTarget.onerror = null // Prevent looping if the fallback image fails to load
            e.currentTarget.src = missingPhoto.src
          }}
        />
      </Link>
    </div>
  )
}
