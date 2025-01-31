import { makeValidStateCode, validateStateCode } from '@/lib/get-state-info'
import { DailyLeaders } from '../../../daily-leaders'
import { mustGetState } from '@/lib/firebase/firestore'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{
    stateCode: string
    year: string
    month: string
    day: string
  }>
}

export default async function StatePage({ params }: Props) {
  const { stateCode, year, month, day } = await params

  if (!validateStateCode(stateCode.toUpperCase())) {
    return notFound()
  }

  const state = await mustGetState(makeValidStateCode(stateCode))

  return (
    <div>
      <DailyLeaders
        state={state}
        year={Number(year)}
        month={Number(month)}
        day={Number(day)}
      />
    </div>
  )
}
