import Image from 'next/image'

export async function PspTitleLogo() {
  return (
    <div className="mx-12 mb-16 mt-8">
      <div className="mx-auto w-full bg-[rgba(0,0,0,0.6)] md:w-[38%]">
        <Image
          className="h-auto w-full"
          width={1500}
          height={351}
          src="/images/public-servants-prayer.png"
          alt="Public Servants' Prayer"
        />
      </div>
    </div>
  )
}
