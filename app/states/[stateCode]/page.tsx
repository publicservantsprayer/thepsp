import { Detect } from './detect'
import { cookies } from 'next/headers'
import { UpdateCookieStateCode } from './update-cookie-state-code'
import { makeValidStateCode } from '@/data/make-valid-state-code'
import { DailyLeaders } from './daily-leaders'

interface Props {
  params: Promise<{
    stateCode: string
  }>
}

export default async function StatePage({ params }: Props) {
  const { stateCode: paramStateCode } = await params
  const cookieStore = await cookies()
  const cookieStateCode = cookieStore.get('stateCode')

  if (paramStateCode === 'detect') {
    return <Detect cookieStateCode={cookieStateCode?.value} />
  }
  const stateCode = makeValidStateCode(paramStateCode)

  return (
    <div>
      <UpdateCookieStateCode paramStateCode={paramStateCode} />
      <DailyLeaders stateCode={stateCode} />
    </div>
  )
}
