import { NextRequest, NextResponse } from 'next/server'
import { leaderPhotoUploadBucket } from '@/lib/firebase/server/admin-app'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { mergeUpdateLeader } from '@/lib/firebase/firestore'
import { revalidatePath } from 'next/cache'
import { downloadImage } from '@/server-functions/leader-photo/download-image'

export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    try {
      mustGetCurrentAdmin()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      )
    }

    // Get JSON data from the request
    const { url, leaderPermaLink, revalidatePath: path } = await request.json()

    if (!url || !leaderPermaLink) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 },
      )
    }

    try {
      // Download the image from the URL
      const { buffer, contentType } = await downloadImage(url)

      // Save uploaded image to bucket
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

      // Update leader data in Firestore
      await mergeUpdateLeader({
        permaLink: leaderPermaLink,
        leaderData: { photoUploadOriginal: fileName },
      })

      // Revalidate path if provided
      if (path) {
        revalidatePath(path)
      }

      // Return success response
      return NextResponse.json({
        success: true,
        photoUploadOriginal: fileName,
      })
    } catch (error) {
      console.error('Failed to upload image from URL:', error)
      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to upload image from URL',
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to process request',
      },
      { status: 500 },
    )
  }
}
