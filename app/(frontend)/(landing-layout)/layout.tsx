import { PspTitleLogo } from '@/components/psp-title-logo'
import { HeroBackground } from '@/components/hero-background'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/payload/globals/Footer/Component'

interface Props {
  children: React.ReactNode
}

export default function LandingPageLayout({ children }: Props) {
  return (
    <>
      <HeroBackground>
        <PspTitleLogo />
        <NavBar />
        {children}
      </HeroBackground>
      <Footer />
    </>
  )
}
