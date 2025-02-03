'use client'

import React from 'react'

import { onAuthStateChanged } from '@/lib/firebase/client/auth'
import { useRouter } from 'next/navigation'
import { CurrentUser } from '@/lib/firebase/server/auth'

export function useUserSession(initialUser: CurrentUser | null) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentUser, setCurrentUser] = React.useState(initialUser)
  const router = useRouter()

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      if (!authUser) {
        setCurrentUser(null)
        setIsLoading(false)
        // Redirect to login if accessing protected route
        if (window.location.pathname.startsWith('/psp-admin')) {
          router.push('/sign-in')
        }
        return
      }

      // Verify token on server-side before updating state
      const verifySession = async () => {
        try {
          const response = await fetch('/api/auth/verify-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uid: authUser.uid,
              token: await authUser.getIdToken(),
            }),
          })

          if (!response.ok) {
            throw new Error('Invalid session')
          }

          const { isAdmin } = await response.json()

          // Only update state if server verification passes
          setCurrentUser({
            authUser,
            uid: authUser.uid,
            email: authUser.email || undefined,
            emailVerified: authUser.emailVerified,
            displayName: authUser.displayName || undefined,
            photoURL: authUser.photoURL || undefined,
            profile: {},
            isAdmin,
          })
        } catch (error) {
          console.error('Session verification failed:', error)
          setCurrentUser(null)
          router.push('/sign-in')
        } finally {
          setIsLoading(false)
        }
      }

      verifySession()
    })

    return () => unsubscribe()
  }, [router])

  return { currentUser, isLoading }
}
