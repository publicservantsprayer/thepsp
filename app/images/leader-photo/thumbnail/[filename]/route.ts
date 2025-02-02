// Import necessary modules
import { leaderThumbnailBucket } from '@/lib/firebase/server/admin-app'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params

  try {
    const file = leaderThumbnailBucket.file(filename) // thumbnail bucket
    const [buffer] = await file.download()

    // Determine the content type based on the file extension if not provided
    let contentType = file.metadata.contentType

    if (!contentType || contentType === 'application/octet-stream') {
      if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
        contentType = 'image/jpeg'
      } else if (filename.endsWith('.png')) {
        contentType = 'image/png'
      } else if (filename.endsWith('.gif')) {
        contentType = 'image/gif'
      } else if (filename.endsWith('.webp')) {
        contentType = 'image/webp'
      } else if (filename.endsWith('.svg')) {
        contentType = 'image/svg+xml'
      } else {
        contentType = 'application/octet-stream'
      }
    }

    // Send the file content as the response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error fetching file:', error)
    return new NextResponse('File not found or error occurred', { status: 404 })
  }
}
