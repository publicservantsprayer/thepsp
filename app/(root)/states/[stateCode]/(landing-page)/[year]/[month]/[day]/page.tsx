import { makeValidStateCode } from '@/lib/get-state-info'
import { DailyLeaders } from '../../../daily-leaders'

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

  return (
    <div>
      <DailyLeaders
        stateCode={makeValidStateCode(stateCode)}
        year={Number(year)}
        month={Number(month)}
        day={Number(day)}
      />
    </div>
  )
}
