import { NextRequest, NextResponse } from 'next/server'
import {
  leaderPhotoUploadBucket,
  leaderThumbnailBucket,
} from '@/lib/firebase/server/admin-app'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { mergeUpdateLeader } from '@/lib/firebase/firestore'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    try {
      mustGetCurrentAdmin()
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      )
    }

    // Get form data from the request
    const formData = await request.formData()
    const leaderPermaLink = formData.get('leaderPermaLink') as string

    if (!leaderPermaLink) {
      return NextResponse.json(
        { success: false, error: 'Missing leaderPermaLink' },
        { status: 400 },
      )
    }

    const croppedImage = formData.get('croppedImage') as File
    const thumbnailImage = formData.get('thumbnailImage') as File

    if (!croppedImage || !thumbnailImage) {
      return NextResponse.json(
        { success: false, error: 'Missing image files' },
        { status: 400 },
      )
    }

    // Convert files to buffers
    const croppedBuffer = new Uint8Array(await croppedImage.arrayBuffer())
    const thumbnailBuffer = new Uint8Array(await thumbnailImage.arrayBuffer())

    // Create file names
    const croppedFileName = `${leaderPermaLink}_cropped.jpg`
    const thumbnailFileName = `${leaderPermaLink}.jpg`

    // Get file references
    const croppedFileRef = leaderPhotoUploadBucket.file(croppedFileName)
    const thumbnailFileRef = leaderThumbnailBucket.file(thumbnailFileName)

    // Upload files to buckets
    await Promise.all([
      croppedFileRef.save(croppedBuffer, {
        contentType: 'image/jpeg',
      }),
      thumbnailFileRef.save(thumbnailBuffer, {
        contentType: 'image/jpeg',
      }),
    ])

    // Update leader data in Firestore
    await mergeUpdateLeader({
      permaLink: leaderPermaLink,
      leaderData: {
        PhotoFile: thumbnailFileName,
        photoUploadCropped: croppedFileName,
        hasPhoto: true,
      },
    })

    // Revalidate path if provided
    const path = formData.get('revalidatePath') as string | undefined
    if (path) {
      revalidatePath(path)
    }

    // Return success response
    return NextResponse.json({
      success: true,
      PhotoFile: thumbnailFileName,
      photoUploadCropped: croppedFileName,
    })
  } catch (error) {
    console.error('Error uploading photos:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to upload photos',
      },
      { status: 500 },
    )
  }
}
