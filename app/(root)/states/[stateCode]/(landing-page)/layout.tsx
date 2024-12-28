import { AppBar } from '@/components/nav-bar/app-bar'
import { getAuthenticatedAppForUser } from '@/lib/firebase/server-app'
import { User } from 'firebase/auth'
import { PspTitleLogo } from '@/components/psp-title-logo'
import { HeroBackground } from '@/components/hero-background'

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

      <HeroBackground>
        <PspTitleLogo />
        {children}
      </HeroBackground>
    </div>
  )
}
