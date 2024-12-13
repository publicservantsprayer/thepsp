'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  signInWithGoogle,
  signOut,
  onAuthStateChanged,
} from '@/lib/firebase/auth'
// import { addFakeRestaurantsAndReviews } from '@/lib/firebase/firestore.js'
import { useRouter } from 'next/navigation'
import { firebaseConfig } from '@/lib/firebase/config'
import { User } from 'firebase/auth'

type Event = React.MouseEvent<HTMLAnchorElement, MouseEvent>

interface Props {
  initialUser: User | null
}

export function AuthButton({ initialUser }: Props) {
  const user = useUserSession(initialUser)

  const handleSignOut = (event: Event) => {
    event.preventDefault()
    signOut()
  }

  const handleSignIn = (event: Event) => {
    event.preventDefault()
    signInWithGoogle()
  }

  return (
    <header>
      {user ? (
        <>
          <div className="profile">
            <p>
              <Image
                width={96}
                height={96}
                src={user.photoURL || '/profile.svg'}
                alt={user.email || 'A placeholder user image'}
              />
              {user.displayName}
            </p>

            <div className="menu">
              ...
              <ul>
                <li>{user.displayName}</li>

                <li>
                  <a href="#" onClick={handleSignOut}>
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="profile">
          <a href="#" onClick={handleSignIn}>
            <img src="/profile.svg" alt="A placeholder user image" />
            Sign In with Google
          </a>
        </div>
      )}
    </header>
  )
}

function useUserSession(initialUser: User | null) {
  // The initialUser comes from the server via a server component
  const [user, setUser] = useState(initialUser)
  const router = useRouter()

  // Register the service worker that sends auth state back to server
  // The service worker is built with npm run build-service-worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const serializedFirebaseConfig = encodeURIComponent(
        JSON.stringify(firebaseConfig)
      )
      const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`

      navigator.serviceWorker
        .register(serviceWorkerUrl)
        .then((registration) => console.log('scope is: ', registration.scope))
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser)
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
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
