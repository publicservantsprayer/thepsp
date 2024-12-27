import Paper from '@mui/material/Paper'
import Image from 'next/image'
import { AppBar } from '@/components/nav-bar/app-bar'

import { getAuthenticatedAppForUser } from '@/lib/firebase/server-app'
import { User } from 'firebase/auth'
import { PspTitleLogo } from '@/components/psp-title-logo'

export const dynamic = 'force-dynamic'

interface Props {
  children: React.ReactNode
}

export default async function StatesLayout({ children }: Props) {
  const { currentUser } = await getAuthenticatedAppForUser()
  const initialUser: User = currentUser?.toJSON() as User

  return (
    <div sx={{ boxShadow: 12 }}>
      <AppBar initialUser={initialUser} />

      <div
        sx={{
          background: {
            sm: 'url("/images/capitol-color-night.jpg") top left no-repeat',
            xs: 'url("/images/capitol-color-night-700.jpg") top left no-repeat',
          },
          backgroundPositionY: { sm: '-400px', xs: '-150px' },
          backgroundAttachment: 'fixed',
          overflow: 'hidden',
          height: { sm: 'auto', xs: '180px' },
        }}
      >
        <PspTitleLogo />
        {children}
      </div>
    </div>
  )
}
