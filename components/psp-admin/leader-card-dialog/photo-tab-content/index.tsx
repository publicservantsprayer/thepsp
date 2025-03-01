/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import Link from 'next/link'
import missingPhoto from '@/public/images/no-image.jpg'
import { PhotoSearchDialog } from './photo-search-dialog'
import { useLeaderData, usePhotoRefresh, getImageUrl } from '../use-leader-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ImageCropper } from './image-response/image-cropper'

export function PhotoTabContent() {
  const { leader } = useLeaderData()
  const { refreshTimestamp } = usePhotoRefresh()
  const [reCropDialogOpen, setReCropDialogOpen] = React.useState(false)
  const [imageTimestamp, setImageTimestamp] = React.useState(Date.now())

  // Update timestamp when leader data changes or when refresh is triggered
  React.useEffect(() => {
    setImageTimestamp(Date.now())
  }, [leader.photoUploadCropped, refreshTimestamp])

  // Function to handle dialog close and refresh the image
  const handleDialogOpenChange = (open: boolean) => {
    setReCropDialogOpen(open)
    if (!open) {
      // When dialog closes, update the timestamp to force image refresh
      setImageTimestamp(Date.now())
    }
  }

  // Common image error handler
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.onerror = null // Prevent looping if the fallback image fails to load
    e.currentTarget.src = missingPhoto.src
  }

  // Generate image URLs with cache busting
  const originalPhotoUrl = leader.photoUploadOriginal
    ? `/images/leader-photo/${leader.photoUploadOriginal}`
    : ''

  const croppedPhotoUrl = leader.photoUploadCropped
    ? getImageUrl(
        `/images/leader-photo/${leader.photoUploadCropped}`,
        imageTimestamp,
      )
    : ''

  return (
    <div className="flex h-[calc(100cqh-8rem)] flex-col items-center justify-center gap-4 p-4">
      {/* Photos Section - Side by Side */}
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
        {/* Original Photo */}
        <div className="flex flex-col items-center">
          <h3 className="mb-2 text-lg font-semibold">Original Photo</h3>
          {leader.photoUploadOriginal ? (
            <img
              src={originalPhotoUrl}
              alt="Original"
              className="max-h-[300px] max-w-full rounded-lg object-contain"
              onError={handleImageError}
            />
          ) : (
            <div className="flex h-[300px] w-full items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                No original photo uploaded
              </p>
            </div>
          )}
        </div>

        {/* Cropped Photo */}
        <div className="flex flex-col items-center">
          <h3 className="mb-2 text-lg font-semibold">Cropped Photo</h3>
          {leader.photoUploadCropped ? (
            <div className="flex flex-col items-center gap-4">
              <img
                src={croppedPhotoUrl}
                alt="Cropped"
                className="max-h-[300px] max-w-full rounded-lg object-contain"
                onError={handleImageError}
              />
              {leader.photoUploadOriginal && (
                <Button
                  variant="outline"
                  onClick={() => setReCropDialogOpen(true)}
                  size="sm"
                >
                  Re-crop Photo
                </Button>
              )}
            </div>
          ) : (
            <div className="flex h-[300px] w-full items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                No cropped photo available
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pt-6">
        {/* Photo Search Dialog Component */}
        <PhotoSearchDialog />

        {/* Link to Original - Only show if there's an original photo */}
        {leader.photoUploadOriginal && (
          <Button variant="secondary" asChild>
            <Link
              href={originalPhotoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Original Uploaded Photo
            </Link>
          </Button>
        )}
      </div>

      {/* Re-crop Dialog */}
      <Dialog open={reCropDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Re-crop Photo</DialogTitle>
          </DialogHeader>
          <ImageCropper onCropComplete={() => setImageTimestamp(Date.now())} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
