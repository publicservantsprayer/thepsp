import { PspTitleLogo } from '@/components/psp-title-logo'
// import { HeroBackground } from '@/components/hero-background'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/payload/globals/Footer/Component'
import Image from 'next/image'
import capitol from '@/public/images/capitol-color-night.jpg'
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

function HeroBackground({ children }: Props) {
  return (
    <div className="relative overflow-hidden">
      <div className="">{children}</div>
      <div className="absolute top-0 -z-10">
        <div className="relative -translate-y-[4rem] sm:-translate-y-[8rem] md:-translate-y-[10rem] lg:-translate-y-[12rem] xl:-translate-y-[16rem] 2xl:-translate-y-[20rem]">
          <Image
            alt="US Capitol Building at night"
            src={capitol}
            placeholder="blur"
            quality={100}
            height={1366}
            width={2048}
            sizes="100vw"
            className="w-[100vw]"
          />
          <div className="absolute bottom-0 z-10 h-1/2 w-full bg-gradient-to-t from-background to-transparent outline-red-400" />
        </div>
      </div>
    </div>
  )
}
