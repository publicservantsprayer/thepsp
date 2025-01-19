import { PspTitleLogo } from '@/components/psp-title-logo'
import { HeroBackground } from '@/components/hero-background'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/payload/globals/Footer/Component'

interface Props {
  children: React.ReactNode
}

export default function DefaultLayout({ children }: Props) {
  return (
    <>
      <HeroBackground>
        <PspTitleLogo />
      </HeroBackground>
      <NavBar />
      <div className="flex flex-col items-center gap-4 pt-8 font-lato">
        {children}
      </div>
      <Footer />
    </>
  )
}
