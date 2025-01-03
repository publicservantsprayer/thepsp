import { PspTitleLogo } from '@/components/psp-title-logo'
import { HeroBackground } from '@/components/hero-background'
import { NavBar } from '@/components/nav-bar'
import Footer from '@/components/footer'

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
      <Footer />
    </>
  )
}

export function DefaultLayout({ children }: Props) {
  return (
    <>
      <NavBar />
      <div className="flex min-h-dvh flex-col">
        <HeroBackground>
          <PspTitleLogo />
        </HeroBackground>
        {children}
        <Footer />
      </div>
    </>
  )
}
