import Paper from '@mui/material/Paper'
import Image from 'next/image'
import { AppBar } from '@/components/nav-bar/app-bar'

import { getAuthenticatedAppForUser } from '@/lib/firebase/server-app'
import { User } from 'firebase/auth'

export const dynamic = 'force-dynamic'

export async function NavBar() {
  const { currentUser } = await getAuthenticatedAppForUser()
  const initialUser: User = currentUser?.toJSON() as User

  console.log({ currentUser })

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
        <div sx={{ mx: 3, mt: 3, mb: 8 }}>
          <Paper
            sx={{
              background: 'rgba(0, 0, 0, 0.6)',
              width: { md: '38%', sm: '100%' },
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            square
          >
            <Image
              sx={{ width: '100%', height: 'auto' }}
              width={1500}
              height={351}
              src="/images/public-servants-prayer.png"
              alt="Public Servants' Prayer"
            />
          </Paper>
        </div>

        {/* <NavBarDailyLeaders /> */}
      </div>
    </div>
  )
}
