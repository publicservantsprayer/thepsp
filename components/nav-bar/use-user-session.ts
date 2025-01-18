'use client'

import React from 'react'

import { onAuthStateChanged } from '@/lib/firebase/client/auth'
import { useRouter } from 'next/navigation'
import { CurrentUser } from '@/lib/firebase/server/auth'

export function useUserSession(initialUser: CurrentUser | null) {
  const [currentUser, setCurrentUser] = React.useState(initialUser)
  const router = useRouter()

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      if (!authUser) {
        setCurrentUser(null)
        return
      }
      if (currentUser?.uid === authUser.uid) {
        setCurrentUser({ ...currentUser, authUser })
      } else {
        setCurrentUser({
          authUser,
          uid: authUser?.uid,
          email: authUser?.email || undefined,
          emailVerified: authUser?.emailVerified,
          displayName: authUser?.displayName || undefined,
          photoURL: authUser?.photoURL || undefined,
          profile: {},
        })
      }
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    onAuthStateChanged((authUser) => {
      if (currentUser === undefined) return

      // refresh when user changed to ease testing
      if (currentUser?.email !== authUser?.email) {
        console.log('refresh when user changed to ease testing')
        router.refresh()
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  return currentUser
}
