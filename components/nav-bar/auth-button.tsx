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
            {/* <Image src="/profile.svg" alt="A placeholder user image" /> */}
            Sign In with Google
          </a>
        </div>
      )}
    </header>
  )
}
