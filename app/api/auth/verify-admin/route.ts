import { getCurrentUser } from '@/lib/firebase/server/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || !currentUser.isAdmin) {
      return new NextResponse(null, { status: 401 })
    }

    return new NextResponse(null, { status: 200 })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return new NextResponse(null, { status: 401 })
  }
}
