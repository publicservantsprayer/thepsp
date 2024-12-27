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

  const stateCode = makeValidStateCode(paramStateCode)

  const leaders = await getLeaders({
    stateCode,
  })

  return (
    <div>
      <StateLeaders leaders={leaders} />
    </div>
  )
}
