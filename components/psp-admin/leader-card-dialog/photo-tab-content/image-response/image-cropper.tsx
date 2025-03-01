'use client'

/* eslint-disable @next/next/no-img-element */
import React from 'react'

import Cropper, { Area } from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/hooks/use-toast'
import { useLeaderData, usePhotoRefresh } from '../../use-leader-data'
import { DialogClose } from '@/components/ui/dialog'
import { uploadCroppedLeaderPhoto } from '@/lib/api/leader-photo'

interface ImageCropperProps {
  onCropComplete?: () => void
}

export function ImageCropper({
  onCropComplete: onCropCompleteCallback,
}: ImageCropperProps) {
  const { leader, setLeader } = useLeaderData()
  const { triggerPhotoRefresh } = usePhotoRefresh()
  const { toast } = useToast()

  // Cropper state
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area>()
  const [isUploading, setIsUploading] = React.useState(false)

  // Constants
  const thumbnailWidth = 108
  const thumbnailHeight = 148

  // Check if we have an original photo to crop
  if (!leader.photoUploadOriginal) {
    return <div>Leader has no photo</div>
  }

  const leaderPhotoUploadOriginalUrl = `/images/leader-photo/${leader.photoUploadOriginal}`

  // Handlers
  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleSaveCroppedImage = async () => {
    if (!croppedAreaPixels) {
      return
    }

    try {
      setIsUploading(true)

      // Get the cropped and resized image as a blob.
      const thumbnailBlob = await getCroppedImg(
        leaderPhotoUploadOriginalUrl,
        croppedAreaPixels,
        0,
        { horizontal: false, vertical: false },
        thumbnailWidth,
        thumbnailHeight,
      )
      if (!thumbnailBlob) return

      // Get the cropped image as a blob.
      const croppedImageBlob = await getCroppedImg(
        leaderPhotoUploadOriginalUrl,
        croppedAreaPixels,
        0,
        { horizontal: false, vertical: false },
      )

      // Convert the blobs into FormData.
      const formData = new FormData()
      formData.append('thumbnailImage', thumbnailBlob as Blob)
      formData.append('croppedImage', croppedImageBlob as Blob)

      // Upload the form data using our client-side utility function
      const result = await uploadCroppedLeaderPhoto({
        formData,
        leaderPermaLink: leader.permaLink,
      })

      if (result.success) {
        // Update leader data
        setLeader({
          ...leader,
          photoUploadCropped: result.photoUploadCropped,
          PhotoFile: result.PhotoFile,
          hasPhoto: true,
        })

        // Trigger photo refresh to update all images
        triggerPhotoRefresh()

        // Call the callback if provided
        if (onCropCompleteCallback) {
          onCropCompleteCallback()
        }

        // Show success message
        toast({
          title: 'Image saved successfully',
          description: 'The cropped photo has been updated.',
        })

        // Close the dialog
        const dialogCloseButton = document.querySelector(
          '[data-dialog-close]',
        ) as HTMLButtonElement | null
        if (dialogCloseButton) {
          dialogCloseButton.click()
        }
      } else {
        toast({
          title: 'Error saving image',
          description: result.error || 'Failed to save the cropped image',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error saving cropped image:', error)
      toast({
        title: 'Error processing image',
        description: 'There was a problem cropping the image.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container">
      <div className="flex flex-col">
        <div className="relative h-[50vh] w-full rounded">
          <Cropper
            image={leaderPhotoUploadOriginalUrl}
            crop={crop}
            zoom={zoom}
            aspect={108 / 148}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        <div className="mt-2">
          <label className="text-sm text-muted-foreground">
            Zoom: {zoom.toFixed(1)}x
          </label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <DialogClose asChild data-dialog-close>
          <Button variant="secondary" className="flex-1" disabled={isUploading}>
            Close
          </Button>
        </DialogClose>
        <Button
          onClick={handleSaveCroppedImage}
          className="flex-1"
          disabled={isUploading}
        >
          {isUploading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  )
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation)

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 */
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  flip = {
    horizontal: false,
    vertical: false,
  },
  targetWidth?: number,
  targetHeight?: number,
) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  const rotRad = getRadianAngle(rotation)

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation,
  )

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
  ctx.translate(-image.width / 2, -image.height / 2)

  // draw rotated image
  ctx.drawImage(image, 0, 0)

  const croppedCanvas = document.createElement('canvas')

  const croppedCtx = croppedCanvas.getContext('2d')

  if (!croppedCtx) {
    return null
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width
  croppedCanvas.height = pixelCrop.height

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  )

  // If target dimensions are provided, create a resized canvas.
  if (targetWidth && targetHeight) {
    const resizedCanvas = document.createElement('canvas')
    const resizedCtx = resizedCanvas.getContext('2d')
    if (!resizedCtx) return null
    resizedCanvas.width = targetWidth
    resizedCanvas.height = targetHeight
    resizedCtx.drawImage(
      croppedCanvas,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      targetWidth,
      targetHeight,
    )
    return new Promise((resolve, reject) => {
      resizedCanvas.toBlob((file) => {
        resolve(file)
      }, 'image/jpeg')
    })
  }

  // Otherwise, return the cropped image.
  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob((file) => {
      resolve(file)
    }, 'image/jpeg')
  })
}
