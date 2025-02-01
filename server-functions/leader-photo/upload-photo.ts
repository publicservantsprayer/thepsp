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

  const file = formData.get('file') as File
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  // save uploaded image to bucket
  const bucket = leaderPhotoUploadBucket
  const fileName = `${leaderPermaLink}.jpg`
  const fileRef = bucket.file(fileName)
  await fileRef.save(buffer)

  await mergeUpdateLeader({
    permaLink: leaderPermaLink,
    leaderData: { photoFile: fileName, hasPhoto: true },
  })

  return { success: true, fileName: fileRef.name }
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
