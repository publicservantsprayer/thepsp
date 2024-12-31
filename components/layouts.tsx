import { PspTitleLogo } from '@/components/psp-title-logo'
import { HeroBackground } from '@/components/hero-background'
import { NavBar } from '@/components/nav-bar'

interface Props {
  children: React.ReactNode
}

export function LandingPageLayout({ children }: Props) {
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

export function DefaultLayout({ children }: Props) {
  return (
    <>
      <NavBar />

      <HeroBackground>
        <PspTitleLogo />
      </HeroBackground>
      {children}
    </>
  )
}
