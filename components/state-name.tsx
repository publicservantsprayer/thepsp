import { getStateInfo } from '@/lib/get-state-info'
import { StateCode } from '@/lib/types'
import { StateNameClient } from './state-name-client'

export function StateName({ stateCode }: { stateCode?: StateCode }) {
  if (stateCode) {
    const { stateName } = getStateInfo(stateCode)

    return <>{stateName}</>
  }

  return <StateNameClient />
}
