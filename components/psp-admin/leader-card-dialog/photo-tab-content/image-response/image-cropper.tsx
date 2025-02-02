'use client'

/* eslint-disable @next/next/no-img-element */
import React from 'react'

import Cropper, { Area } from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { serverUploadFileFromFormData } from '@/server-functions/leader-photo/upload-photo'
import { useToast } from '@/components/hooks/use-toast'
import { useLeaderData } from '../../use-leader-data'
import { DialogClose } from '@/components/ui/dialog'

export function ImageCropper() {
  const { leader, setLeader } = useLeaderData()
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area>()
  const thumbnailWidth = 108
  const thumbnailHeight = 148
  const { toast } = useToast()

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  if (!leader.photoUploadOriginal) {
    return <div>Leader has no photo</div>
  }
  const leaderPhotoUploadOriginalUrl = `/images/leader-photo/${leader.photoUploadOriginal}`

  const handleSaveCroppedImage = async () => {
    if (!croppedAreaPixels) {
      return
    }

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

    // Upload the form data to the server.
    const result = await serverUploadFileFromFormData({
      formData,
      leaderPermaLink: leader.permaLink,
      // Maybe we don't want to revalidate the path here because it
      // will cause a page reload and we don't want to lose the current
      // dialog state.
      // revalidatePath: '/psp-admin/leaders-without-photos',
    })
    if (result.success) {
      setLeader({
        ...leader,
        photoUploadCropped: result.photoUploadCropped,
        PhotoFile: result.PhotoFile,
        hasPhoto: true,
      })
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
      <div className="mt-4 flex flex-col gap-4">
        <Button onClick={handleSaveCroppedImage}>Save</Button>
        <DialogClose asChild>
          <Button variant="secondary">Close</Button>
        </DialogClose>
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
