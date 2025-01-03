'use client'

import React from 'react'

import { onAuthStateChanged } from '@/lib/firebase/auth'
import { useRouter } from 'next/navigation'
import { firebaseConfig } from '@/lib/firebase/config'
import { User } from 'firebase/auth'

export function useUserSession(initialUser: User | null) {
  // The initialUser comes from the server via a server component
  const [user, setUser] = React.useState(initialUser)
  const router = useRouter()

  // Register the service worker that sends auth state back to server
  // The service worker is built with npm run build-service-worker
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      const serializedFirebaseConfig = encodeURIComponent(
        JSON.stringify(firebaseConfig),
      )
      const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`

      navigator.serviceWorker
        .register(serviceWorkerUrl)
        .then((registration) => console.log('scope is: ', registration.scope))
    }
  }, [])

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser)
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    onAuthStateChanged((authUser) => {
      if (user === undefined) return

      // refresh when user changed to ease testing
      if (user?.email !== authUser?.email) {
        router.refresh()
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return user
}
