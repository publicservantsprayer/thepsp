'use client'

import React from 'react'
import { H4 } from '@/components/formatting'
import { Leaders } from './leaders'
import { Divider } from '@mui/material'
import { useUSAState } from '@/hooks/use-usa-state'

interface Props {
  chamber: string
  currentTab: number
  index: number
}

export function TabPanel({ chamber, currentTab, index }: Props) {
  const { stateName } = useUSAState()
  const chamberTitle = chamber === 'H' ? 'Representatives' : 'Senators'

  return (
    <div role="tabpanel" hidden={currentTab !== index}>
      <div className="px-2 pt-5 text-center">
        <H4>
          US {chamberTitle} from {stateName}
        </H4>
      </div>
      <div className="flex flex-wrap justify-center mb-3">
        <Leaders legType="FL" chamber={chamber} />
      </div>
      <Divider />
      <div className="px-2 pt-5 text-center">
        <H4>
          {stateName} State {chamberTitle}
        </H4>
      </div>
      <div className="flex flex-wrap justify-center">
        <Leaders legType="SL" chamber={chamber} />
      </div>
    </div>
  )
}
