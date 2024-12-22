import { Detect } from './detect'
import { cookies } from 'next/headers'
import { UpdateCookieStateCode } from './update-cookie-state-code'
import { StateLeaders } from './state-leaders'

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

  return (
    <div>
      <UpdateCookieStateCode paramStateCode={paramStateCode} />
      <StateLeaders />
    </div>
  )
}
