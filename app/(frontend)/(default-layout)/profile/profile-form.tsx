'use client'

import React from 'react'

import { useUserSession } from '@/components/nav-bar/use-user-session'
import { CurrentUser } from '@/lib/firebase/server/auth'

export function ProfileForm({
  initialUser,
}: {
  initialUser: CurrentUser | null
}) {
  const { currentUser: user, isLoading } = useUserSession(initialUser)
  if (isLoading) return <div>Loading...</div>

  if (!user) {
    return null
  }

  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* <ProfileForm user={user} /> */}
        <div>{user.displayName}</div>
        <div>{user.email}</div>
      </div>
    </div>
  )
}
