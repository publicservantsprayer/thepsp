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
    <div className="">
      <NavBar />
      <div className="flex min-h-dvh flex-col">
        <HeroBackground>
          <PspTitleLogo />
        </HeroBackground>
        <div className="font-lato flex flex-col items-center gap-4 pt-8">
          <div className="">{children}</div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
