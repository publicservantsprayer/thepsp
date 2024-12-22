import { Detect } from './detect'
import { cookies } from 'next/headers'
import { UpdateCookieStateCode } from './update-cookie-state-code'
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

  console.log('paramStateCode', paramStateCode)

  return (
    <div>
      <UpdateCookieStateCode paramStateCode={paramStateCode} />
    </div>
  )
}
