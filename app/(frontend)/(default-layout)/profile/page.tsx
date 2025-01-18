import React from 'react'

import { ProfileForm } from './profile-form'
import { getCurrentUser } from '@/lib/firebase/server/auth'

export default async function ProfilePage() {
  const initialUser = await getCurrentUser()

  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ProfileForm initialUser={initialUser} />
      </div>
    </div>
  )
}
