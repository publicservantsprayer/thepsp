import { cookies } from 'next/headers'
import { UpdateCookieStateCode } from './update-cookie-state-code'
import { makeValidStateCode, validateStateCode } from '@/lib/get-state-info'
import { DailyLeaders } from './daily-leaders'
import { notFound } from 'next/navigation'

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
    <div>
      <UpdateCookieStateCode paramStateCode={paramStateCode} />
      <DailyLeaders stateCode={stateCode} />
    </div>
  )
}
