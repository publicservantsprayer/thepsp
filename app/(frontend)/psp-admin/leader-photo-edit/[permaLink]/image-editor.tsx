'use client'

/* eslint-disable @next/next/no-img-element */
import React from 'react'

import Cropper, { Area } from 'react-easy-crop'

import { Button } from '@/components/ui/button'

import { Leader } from '@/lib/types'
import { uploadFileFromFormData } from '@/server-functions/leader-photo/upload-photo'
import { useToast } from '@/components/hooks/use-toast'

export function ImageEditor({ leader }: { leader: Leader }) {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area>()
  const [croppedImage, setCroppedImage] = React.useState(null)
  const [targetWidth, setTargetWidth] = React.useState(108)
  const [targetHeight, setTargetHeight] = React.useState(148)
  const { toast } = useToast()

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  if (!leader.photoUploadOriginal) {
    return <div>Leader has no photo</div>
  }
  const leaderPhotoUploadOriginalUrl = `/api/leader-photo/${leader.photoUploadOriginal}`

  const handleSaveCroppedImage = async () => {
    if (!croppedAreaPixels) {
      return
    }

    // Get the cropped (and optionally resized) image as a blob.
    const blob = await getCroppedImg(
      leaderPhotoUploadOriginalUrl,
      croppedAreaPixels,
      0,
      { horizontal: false, vertical: false },
      targetWidth,
      targetHeight,
    )
    if (!blob) return

    // Convert the blob into FormData.
    const formData = new FormData()
    formData.append('file', blob as Blob, 'cropped-image.jpg')
    formData.append('leaderPermaLink', leader.permaLink)

    // Upload the form data to the server.
    const result = await uploadFileFromFormData({
      formData,
      leaderPermaLink: leader.permaLink,
    })
    if (result.success) {
      toast({
        title: 'Image saved successfully',
      })
    } else {
      toast({
        title: 'Error saving image',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container">
      <div className="relative h-[60vh] w-full rounded">
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
      <div className="mt-4 flex justify-end">
        <Button onClick={handleSaveCroppedImage}>Save</Button>
      </div>
    </div>
  )
}

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
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
export default async function getCroppedImg(
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
