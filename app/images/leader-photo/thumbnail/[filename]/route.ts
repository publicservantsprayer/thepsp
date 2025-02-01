// Import necessary modules
import { leaderBucket } from '@/lib/firebase/server/admin-app'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  mustGetCurrentAdmin()
  const { filename } = await params

  try {
    const file = leaderBucket.file(filename) // thumbnail bucket
    const [buffer] = await file.download()

    // Determine the content type based on the file extension or metadata
    const contentType = file.metadata.contentType || 'application/octet-stream'

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
