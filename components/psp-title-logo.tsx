import Image from 'next/image'

export async function PspTitleLogo() {
  return (
    <div className="mx-12 mt-12 mb-16">
      <div className="bg-[rgba(0,0,0,0.6)] w-full md:w-[38%] mx-auto">
        <Image
          className="w-full h-auto"
          width={1500}
          height={351}
          src="/images/public-servants-prayer.png"
          alt="Public Servants' Prayer"
        />
      </div>
    </div>
  )
}
