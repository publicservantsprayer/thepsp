'use client'

import React, { use } from 'react'
import { H4 } from '@/components/formatting'
import { Leaders } from './leaders'
import { Divider } from '@mui/material'
// import { USAStateContext } from '@/hooks/use-usa-state'
import { Leader } from '@/lib/leader'

interface Props {
  leaders: Leader[]
  chamber: Leader['Chamber']
}

export function TabPanel({ leaders, chamber }: Props) {
  // const { stateName } = use(USAStateContext)
  const chamberTitle = chamber === 'H' ? 'Representatives' : 'Senators'

  return (
    <div role="tabpanel">
      <div className="px-2 pt-5 text-center">
        <H4>
          US {chamberTitle} from {stateName}
        </H4>
      </div>
      <div className="flex flex-wrap justify-center mb-3">
        <Leaders leaders={leaders} legType="FL" chamber={chamber} />
      </div>
      <Divider />
      <div className="px-2 pt-5 text-center">
        <H4>
          {stateName} State {chamberTitle}
        </H4>
      </div>
      <div className="flex flex-wrap justify-center">
        <Leaders leaders={leaders} legType="SL" chamber={chamber} />
      </div>
    </div>
  )
}
