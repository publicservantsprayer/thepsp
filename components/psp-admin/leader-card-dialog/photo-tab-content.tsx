/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import Link from 'next/link'
import { Leader } from '@/lib/types'
import missingPhoto from '@/public/images/no-image.jpg'
import { PhotoSearchDialog } from './photo-search-dialog'

export interface PhotoTabContentProps {
  leader: Leader
}

export function PhotoTabContent({ leader }: PhotoTabContentProps) {
  console.log('leader', leader)
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Cropped Image Section */}
      <div className="flex flex-col items-center">
        <h3 className="mb-2 text-lg font-semibold">Cropped Upload</h3>
        <img
          src={`/images/leader-photo/${leader.photoUploadCropped}`}
          alt="Cropped"
          className="max-w-full rounded-lg object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null // Prevents looping if missingPhoto fails
            e.currentTarget.src = missingPhoto.src
          }}
        />
      </div>

      {/* Link to Original */}
      <div className="text-center">
        <Link
          href={`/images/leader-photo/${leader.photoUploadOriginal}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:underline"
        >
          View Original Uploaded Photo
        </Link>
      </div>

      {/* Photo Search Dialog Component */}
      <PhotoSearchDialog leader={leader} />
    </div>
  )
}
