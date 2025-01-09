import 'server-only'

import React from 'react'

import { cookies } from 'next/headers'
import { auth } from '@/lib/firebase/server/admin-app'
import { SessionCookieOptions, UserRecord } from 'firebase-admin/auth'
// import { UserModel, UserRepository } from '@/lib/models/user'

export type CurrentUser = Awaited<ReturnType<typeof mustGetCurrentUser>>
export type CurrentUserDTO = Awaited<ReturnType<typeof mustGetCurrentUserDTO>>

// type AuthUser = {
//   uid: string
//   email?: string
//   displayName?: string
//   photoURL?: string
// }

// export const mustGetCurrentUnEnabledUser = async () => {
//   const currentUser = await getCurrentUser()

//   if (!currentUser) {
//     throw new Error('Not authenticated!')
//   }

//   return currentUser
// }

export const mustGetCurrentUser = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    throw new Error('Not authenticated!')
  }

  // if (!currentUser.isEnabled()) {
  //   throw new Error('User has not yet been enabled.')
  // }

  return currentUser
}

// export const mustGetCurrentAdmin = async () => {
//   const currentUser = await mustGetCurrentUser()

//   if (!currentUser.isAdmin()) {
//     throw new Error('Not an admin!')
//   }

//   return currentUser
// }

/**
 * Get the current user from the session cookie.
 *
 * This includes the user's information from the Firebase Auth service,
 * as well as the user's information from the database.
 *
 * @returns The current user or null if not authenticated.
 */
export const getCurrentUser = React.cache(
  async (): Promise<UserRecord | null> => {
    const session = await getSession()

    if (!(await verifySession(session))) {
      return null
    }

    const decodedIdToken = await auth.verifySessionCookie(session!)
    const authUser = await auth.getUser(decodedIdToken.uid)

    // const user = await new UserRepository().findById(authUser.uid)

    // if (!user) {
    //   throw new Error('User authenticated but not found in database')
    // }

    // user.authUser = authUser

    return authUser
  },
)

/**
 * Get the current authUser from the session cookie, and check to see if
 * the user account has been created in firestore.
 *
 * @returns Current user or null if account has not been created.
 */
// export const checkIfAccountCreatedForCurrentUser = async () => {
//   const session = await getSession()

//   if (!(await verifySession(session))) {
//     console.error('Session not verified while waiting for account creation')
//     return null
//   }

//   const decodedIdToken = await auth.verifySessionCookie(session!)
//   const authUser = await auth.getUser(decodedIdToken.uid)
//   const user = await new UserRepository().findById(authUser.uid)

//   return !!user
// }

export const getCurrentUserDTO = async () => {
  const currentUser = await getCurrentUser()

  // return currentUser?.toDTO()
  return currentUser?.toJSON()
}

export const mustGetCurrentUserDTO = async () => {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    throw new Error('Not authenticated!')
  }

  return currentUser?.toJSON()
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
