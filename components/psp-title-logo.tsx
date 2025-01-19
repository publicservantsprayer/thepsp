import Image from 'next/image'

export async function PspTitleLogo() {
  return (
    <div className="mx-auto my-6">
      <div className="mx-auto w-10/12 rounded-md bg-[rgba(0,0,0,0.6)] sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl">
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
