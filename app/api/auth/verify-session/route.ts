import { auth } from '@/lib/firebase/server/admin-app'
import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase/server/admin-app'

export async function POST(request: Request) {
  try {
    const { token, uid } = await request.json()

    // Verify the token
    const decodedToken = await auth.verifyIdToken(token)

    // Verify the UID matches
    if (decodedToken.uid !== uid) {
      throw new Error('UID mismatch')
    }

    // Get admin status
    const adminUserSnapshot = await db
      .collection('adminUsers')
      .where('email', '==', decodedToken.email)
      .get()

    return NextResponse.json({
      verified: true,
      isAdmin: !adminUserSnapshot.empty,
    })
  } catch (error) {
    console.error('Session verification failed:', error)
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }
}
