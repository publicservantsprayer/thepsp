// Import necessary modules
import { leaderPhotoUploadBucket } from '@/lib/firebase/server/admin-app'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } },
) {
  mustGetCurrentAdmin()
  const objectName = params.name

  try {
    const file = leaderPhotoUploadBucket.file(objectName)
    const [buffer] = await file.download()

    // Determine the content type based on the file extension or metadata
    const contentType = file.metadata.contentType || 'application/octet-stream'

    // Send the file content as the response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${objectName}"`,
      },
    })
  } catch (error) {
    console.error('Error fetching file:', error)
    return new NextResponse('File not found or error occurred', { status: 404 })
  }
}
