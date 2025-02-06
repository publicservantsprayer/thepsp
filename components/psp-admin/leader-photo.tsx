'use client'

/* eslint-disable @next/next/no-img-element */
import missingPhoto from '@/public/images/no-image.jpg'
import { Leader } from '@/lib/types'

interface LeaderPhotoProps {
  leader: Leader
  className?: string
}

export function LeaderPhoto({
  leader,
  className = 'h-[37px] w-[27px] rounded',
}: LeaderPhotoProps) {
  return (
    <img
      src={
        leader.hasPhoto
          ? `/images/leader-photo/thumbnail/${leader.PhotoFile}`
          : missingPhoto.src
      }
      alt="Thumbnail"
      className={className}
      onError={(e) => {
        e.currentTarget.onerror = null // Prevent looping if the fallback image fails to load
        e.currentTarget.src = missingPhoto.src
      }}
    />
  )
}
