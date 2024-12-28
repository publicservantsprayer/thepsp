'use client'

import React from 'react'
import { H4 } from '@/components/formatting'
import { Leaders } from './leaders'
import { Divider } from '@mui/material'
import { useUSAState } from '@/hooks/use-usa-state'
import { Leader } from '@/lib/types'

interface Props {
  leaders: Leader[]
  chamber: Leader['Chamber']
}

export function TabPanel({ leaders, chamber }: Props) {
  const { stateName } = useUSAState()
  const chamberTitle = chamber === 'H' ? 'Representatives' : 'Senators'

  return (
    <div role="tabpanel">
      <div className="px-2 pt-5 text-center">
        <H4>
          US {chamberTitle} from {stateName}
        </H4>
      </div>
      <div className="mb-3 flex flex-wrap justify-center">
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
