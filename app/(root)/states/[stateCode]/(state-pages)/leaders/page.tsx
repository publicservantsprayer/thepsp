import { StateLeaders } from './state-leaders'
import { getLeaders } from '@/lib/firebase/firestore'
import { validateStateCode } from '@/lib/get-state-info'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{
    stateCode: string
  }>
}

export default async function StatePage({ params }: Props) {
  const { stateCode: paramStateCode } = await params

  const stateCode = validateStateCode(paramStateCode)

  if (!stateCode) return notFound()

  const leaders = await getLeaders({
    stateCode,
  })

  return (
    <div>
      <StateLeaders leaders={leaders} />
    </div>
  )
}