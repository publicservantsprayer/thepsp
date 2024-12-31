'use client'

import { useUSAState } from '@/hooks/use-usa-state'

export function StateName() {
  const { stateName } = useUSAState()

  return <>{stateName}</>
}
