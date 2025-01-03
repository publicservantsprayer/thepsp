'use client'

import React from 'react'

import { useUSAState } from '@/hooks/use-usa-state'
import { getStateInfo } from '@/lib/get-state-info'

export function StateNameClient() {
  const { stateCode } = useUSAState()
  const [stateName, setStateName] = React.useState('')

  React.useEffect(() => {
    if (stateCode) {
      const { stateName } = getStateInfo(stateCode)
      setStateName(stateName)
    }
  }, [stateCode])

  return <>{stateName}</>
}
