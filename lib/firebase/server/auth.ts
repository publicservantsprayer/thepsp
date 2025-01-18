// This prevents type generation.  Consider adding them back
import 'server-only'

import React from 'react'

import { cookies } from 'next/headers'
import { auth, db } from '@/lib/firebase/server/admin-app'
import { SessionCookieOptions } from 'firebase-admin/auth'
import { User } from 'firebase/auth'

export interface CurrentUser {
  authUser: User | null
  // userRecordToJSON: ReturnType<UserRecord['toJSON']>
  uid: string
  email?: string
  emailVerified: boolean
  displayName?: string
  photoURL?: string
  profile: {
    id?: string
    dailyEmailStateCode?: string
    sendDailyEmail?: boolean
  }
  isAdmin?: boolean
  serverAuth?: boolean
}

/**
 * Get the current user from the session cookie.
 *
 * This includes the user's information from the Firebase Auth service,
 * as well as the user's information from the database.
 *
 * @returns The current user or null if not authenticated.
 */
export const getCurrentUser = React.cache(
  async (): Promise<CurrentUser | null> => {
    const session = await getSession()

    if (!(await verifySession(session))) {
      return null
    }

    const decodedIdToken = await auth.verifySessionCookie(session!)
    const authUser = await auth.getUser(decodedIdToken.uid)

    const currentUser: CurrentUser = {
      authUser: null,
      uid: authUser.uid,
      email: authUser.email,
      emailVerified: authUser.emailVerified,
      displayName: authUser.displayName,
      photoURL: authUser.photoURL,
      profile: {},
      serverAuth: true,
    }

    const userProfile = await db
      .collection('userProfiles')
      .where('email', '==', authUser.email)
      .get()

    if (userProfile.empty) {
      currentUser.profile = {}
    } else {
      const userProfileDoc = userProfile.docs[0]
      currentUser.profile = userProfileDoc.data()
    }

    const adminUserSnapshot = await db
      .collection('adminUsers')
      .where('email', '==', authUser.email)
      .get()

    if (!adminUserSnapshot.empty) {
      currentUser.isAdmin = true
    }

    return currentUser
  },
)

export const mustGetCurrentUser = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    throw new Error('Not authenticated!')
  }

  return currentUser
}

export const mustGetCurrentAdmin = async () => {
  const currentUser = await mustGetCurrentUser()

  if (!currentUser.isAdmin) {
    throw new Error('Not an admin!')
  }

  return currentUser
}

async function verifySession(session: string | undefined = undefined) {
  const _session = session ?? (await getSession())
  if (!_session) return false

  try {
    const isRevoked = !(await auth.verifySessionCookie(_session, true))
    return !isRevoked
  } catch (error) {
    console.warn(error)
    return false
  }
}

async function getSession() {
  const cookieStore = await cookies()
  try {
    return cookieStore.get('__session')?.value
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function createSessionCookie(
  idToken: string,
  sessionCookieOptions: SessionCookieOptions,
) {
  return auth.createSessionCookie(idToken, sessionCookieOptions)
}

export async function revokeAllSessions(session: string) {
  const decodedIdToken = await auth.verifySessionCookie(session)

  return await auth.revokeRefreshTokens(decodedIdToken.sub)
}
