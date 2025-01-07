import { PspTitleLogo } from '@/components/psp-title-logo'
import { HeroBackground } from '@/components/hero-background'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/payload/globals/Footer/Component'

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
      <HeroBackground>
        <PspTitleLogo />
      </HeroBackground>
      <div className="flex flex-col items-center gap-4 pt-8 font-lato">
        <div className="">{children}</div>
      </div>
      <Footer />
    </>
  )
}
