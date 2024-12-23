import { Detect } from './detect'
import { cookies } from 'next/headers'
import { UpdateCookieStateCode } from './update-cookie-state-code'
import { StateLeaders } from './state-leaders'
import { getLeaders } from '@/lib/firebase/firestore'
import { makeValidStateCode } from '@/data/make-valid-state-code'

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

  const leaders = await getLeaders({
    stateCode,
  })

  return (
    <div>
      <UpdateCookieStateCode paramStateCode={paramStateCode} />
      <StateLeaders leaders={leaders} />
    </div>
  )
}
