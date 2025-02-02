'use server'

import {
  leaderPhotoUploadBucket,
  leaderThumbnailBucket,
} from '@/lib/firebase/server/admin-app'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { downloadImage } from './download-image'
import { mergeUpdateLeader } from '@/lib/firebase/firestore'
import { revalidatePath } from 'next/cache'

/**
 * Uploads a file from a FormData object to the bucket.
 */
export async function serverUploadFileFromFormData({
  formData,
  leaderPermaLink,
  revalidatePath: path,
}: {
  formData: FormData
  leaderPermaLink: string
  revalidatePath?: string
}) {
  mustGetCurrentAdmin()

  const croppedImage = formData.get('croppedImage') as File
  const thumbnailImage = formData.get('thumbnailImage') as File

  const croppedBuffer = new Uint8Array(await croppedImage.arrayBuffer())
  const thumbnailBuffer = new Uint8Array(await thumbnailImage.arrayBuffer())

  const croppedFileName = `${leaderPermaLink}_cropped.jpg`
  const thumbnailFileName = `${leaderPermaLink}.jpg`

  const croppedFileRef = leaderPhotoUploadBucket.file(croppedFileName)
  const thumbnailFileRef = leaderThumbnailBucket.file(thumbnailFileName)

  await Promise.all([
    croppedFileRef.save(croppedBuffer),
    thumbnailFileRef.save(thumbnailBuffer),
  ])

  console.log('saving cropped and thumbnail filenames')
  await mergeUpdateLeader({
    permaLink: leaderPermaLink,
    leaderData: {
      PhotoFile: thumbnailFileName,
      photoUploadCropped: croppedFileName,
      hasPhoto: true,
    },
  })

  if (path) {
    revalidatePath(path)
  }

  return {
    success: true,
    PhotoFile: thumbnailFileRef.name,
    photoUploadCropped: croppedFileRef.name,
  }
}

/**
 * Uploads a file from a URL to the bucket.
 */
export async function serverUploadFileFromUrl({
  url,
  leaderPermaLink,
  revalidatePath: path,
}: {
  url: string
  leaderPermaLink: string
  revalidatePath?: string
}) {
  mustGetCurrentAdmin()

  try {
    const { buffer, contentType } = await downloadImage(url)

    // save uploaded image to bucket
    const bucket = leaderPhotoUploadBucket
    const extension = contentType.split('/')[1] || 'jpg'
    const fileName = `${leaderPermaLink}_original.${extension}`
    const fileRef = bucket.file(fileName)
    await fileRef.save(buffer, {
      contentType,
      metadata: {
        contentType,
        sourceUrl: url,
      },
    })

    await mergeUpdateLeader({
      permaLink: leaderPermaLink,
      leaderData: { photoUploadOriginal: fileName },
    })

    if (path) {
      revalidatePath(path)
    }

    return { success: true, photoUploadOriginal: fileName }
  } catch (error) {
    console.error('Failed to upload image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
    }
  }
}
