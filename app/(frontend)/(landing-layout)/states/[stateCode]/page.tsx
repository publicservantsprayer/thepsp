import { cookies } from 'next/headers'
import { UpdateCookieStateCode } from './update-cookie-state-code'
import { makeValidStateCode, validateStateCode } from '@/lib/get-state-info'
import { DailyLeaders } from './daily-leaders'
import { notFound } from 'next/navigation'
import { Info } from 'lucide-react'

interface Props {
  params: Promise<{
    stateCode: string
  }>
}

export default async function StatePage({ params }: Props) {
  const { stateCode: paramStateCode } = await params
  const cookieStore = await cookies()
  const cookieStateCode = cookieStore.get('stateCode')

  if (!validateStateCode(paramStateCode.toUpperCase())) {
    return notFound()
  }

  const stateCode = makeValidStateCode(paramStateCode)

  console.log({ paramStateCode, cookieStateCode, stateCode })

  return (
    <div className="px-4">
      <UpdateCookieStateCode paramStateCode={paramStateCode} />

      {/* Temporary Info */}
      <div className="mb-4 mt-10 flex flex-col items-center">
        <div className="mb-4 flex max-w-[900px] flex-row gap-1 rounded-xl border border-psp-primary-foreground bg-card p-2 md:p-6">
          <div className="m-1 text-psp-primary-foreground">
            <Info />
          </div>
          <div className="ml-2 text-sm md:ml-4 md:text-base lg:text-lg xl:text-xl">
            Currently, our daily posts are on pause as we compile and update
            information on the numerous new public servants who have taken
            office following the 2024 general election.
          </div>
        </div>
      </div>

      <DailyLeaders stateCode={stateCode} />
    </div>
  )
}
