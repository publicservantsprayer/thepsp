'use client'

import React from 'react'

import { useUserSession } from '@/components/nav-bar/use-user-session'
import { User } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export function ProfileForm({ initialUser }: { initialUser: User }) {
  const user = useUserSession(initialUser)
  const router = useRouter()

  React.useEffect(() => {
    if (!user) {
      // TODO: Redirect to sign-in page, however, this currently causes a loop
      // router.push('/sign-in')
    }
  }, [router, user])

  if (!user) {
    return null
  }

  return (
    <div className="flex w-full items-center justify-center p-6 outline md:p-10">
      <div className="w-full max-w-sm">
        {/* <ProfileForm user={user} /> */}
        {user.displayName}
        {user.email}
      </div>
    </div>
  )
}
