'use server'

import { leaderPhotoUploadBucket } from '@/lib/firebase/server/admin-app'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { downloadImage } from './download-image'
import { mergeUpdateLeader } from '@/lib/firebase/firestore'

/**
 * Uploads a file from a FormData object to the bucket.
 */
export async function uploadFileFromFormData({
  formData,
  leaderPermaLink,
}: {
  formData: FormData
  leaderPermaLink: string
}) {
  mustGetCurrentAdmin()

  const croppedImage = formData.get('croppedImage') as File
  const thumbnailImage = formData.get('thumbnailImage') as File

  const croppedBuffer = new Uint8Array(await croppedImage.arrayBuffer())
  const thumbnailBuffer = new Uint8Array(await thumbnailImage.arrayBuffer())

  // save uploaded images to bucket
  const bucket = leaderPhotoUploadBucket
  const croppedFileName = `${leaderPermaLink}_cropped.jpg`
  const thumbnailFileName = `${leaderPermaLink}.jpg`

  const croppedFileRef = bucket.file(croppedFileName)
  const thumbnailFileRef = bucket.file(thumbnailFileName)

  await Promise.all([
    croppedFileRef.save(croppedBuffer),
    thumbnailFileRef.save(thumbnailBuffer),
  ])

  await mergeUpdateLeader({
    permaLink: leaderPermaLink,
    leaderData: {
      photoFile: croppedFileName,
      hasPhoto: true,
    },
  })

  return {
    success: true,
    croppedFileName: croppedFileRef.name,
    thumbnailFileName: thumbnailFileRef.name,
  }
}

/**
 * Uploads a file from a URL to the bucket.
 */
export async function uploadFileFromUrl({
  url,
  leaderPermaLink,
}: {
  url: string
  leaderPermaLink: string
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

    return { success: true, fileName: fileRef.name }
  } catch (error) {
    console.error('Failed to upload image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
    }
  }
}
