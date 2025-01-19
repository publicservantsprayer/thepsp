'use client'

import React from 'react'
import { Leaders } from './leaders'
import { useUSAState } from '@/hooks/use-usa-state'
import { Leader } from '@/lib/types'
import { Separator } from '@/components/ui/separator'

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
        <h2 className="text-2xl">
          US {chamberTitle} from {stateName}
        </h2>
      </div>
      <div className="mb-3 flex flex-wrap justify-center">
        <Leaders leaders={leaders} legType="FL" chamber={chamber} />
      </div>
      <Separator />
      <div className="px-2 pt-5 text-center">
        <h2 className="text-2xl">
          {stateName} State {chamberTitle}
        </h2>
      </div>
      <div className="flex flex-wrap justify-center">
        <Leaders leaders={leaders} legType="SL" chamber={chamber} />
      </div>
    </div>
  )
}
