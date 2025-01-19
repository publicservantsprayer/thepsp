import Image from 'next/image'
import capitol from '@/public/images/capitol-color-night.jpg'
interface Props {
  children: React.ReactNode
}

export async function HeroBackground({ children }: Props) {
  return (
    <div className="relative">
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
          <div className="absolute bottom-0 z-10 h-1/2 w-full bg-gradient-to-t from-background to-transparent" />
        </div>
      </div>
    </div>
  )
}
