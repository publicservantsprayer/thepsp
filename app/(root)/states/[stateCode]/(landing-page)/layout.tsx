import { PspTitleLogo } from '@/components/psp-title-logo'
import { HeroBackground } from '@/components/hero-background'
import { NavBar } from '@/components/nav-bar'

export const dynamic = 'force-dynamic'

interface Props {
  children: React.ReactNode
}

export default async function StatesLayout({ children }: Props) {
  return (
    <>
      <NavBar />

      <HeroBackground>
        <PspTitleLogo />
        {children}
      </HeroBackground>
    </>
  )
}
