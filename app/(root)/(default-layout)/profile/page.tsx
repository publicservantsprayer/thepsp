import React from 'react'

import { User } from 'firebase/auth'
import { getAuthenticatedAppForUser } from '@/lib/firebase/server-app'
import { ProfileForm } from './profile-form'

export default async function ProfilePage() {
  const { currentUser } = await getAuthenticatedAppForUser()
  const initialUser: User = currentUser?.toJSON() as User

  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ProfileForm initialUser={initialUser} />
      </div>
    </div>
  )
}
