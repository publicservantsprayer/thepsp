/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import Link from 'next/link'
import missingPhoto from '@/public/images/no-image.jpg'
import { PhotoSearchDialog } from './photo-search-dialog'
import { useLeaderData } from '../use-leader-data'
import { Button } from '@/components/ui/button'

export function PhotoTabContent() {
  const { leader } = useLeaderData()

  return (
    <div className="flex h-[calc(100cqh-8rem)] flex-col items-center justify-center gap-4 p-4">
      {/* Cropped Image Section */}
      {leader.photoUploadCropped && (
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
      )}

      {!leader.photoUploadCropped && (
        <div className="flex flex-col items-center">
          <h3 className="mb-2 py-12 text-lg font-semibold">
            No photo uploaded yet.
          </h3>
        </div>
      )}

      <div className="mx-auto flex w-2/3 flex-col gap-6">
        {/* Photo Search Dialog Component */}
        <PhotoSearchDialog />

        {/* Link to Original */}
        <Button variant="secondary" asChild>
          <Link
            href={`/images/leader-photo/${leader.photoUploadOriginal}`}
            target="_blank"
            rel="noopener noreferrer"
            className=""
          >
            View Original Uploaded Photo
          </Link>
        </Button>
      </div>
    </div>
  )
}
