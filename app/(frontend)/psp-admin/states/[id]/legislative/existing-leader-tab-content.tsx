'use client'

import { Button } from '@/components/ui/button'
import { LeaderCard } from '@/components/leader-card'
import { useToast } from '@/components/hooks/use-toast'
import { serverSetExistingLeaderToOffice } from '@/server-functions/new-leaders/set-existing-leader-to-office'
import {
  Branch,
  District,
  Jurisdiction,
  Leader,
  LegislativeChamber,
  State,
} from '@/lib/types'
import { SearchLeaderHit } from './leader-search-card'
import React from 'react'

interface ExistingLeaderTabContentProps {
  existingLeader: SearchLeaderHit | undefined
  stateLeader: Leader | undefined
  state: State
  stateLeaderDistrict: District | undefined
  district: District
  jurisdiction: Jurisdiction
  legislativeChamber: LegislativeChamber
  branch: Branch
  onSuccess: () => void
}

export function ExistingLeaderTabContent({
  existingLeader,
  stateLeader,
  state,
  stateLeaderDistrict,
  district,
  jurisdiction,
  legislativeChamber,
  onSuccess,
  branch,
}: ExistingLeaderTabContentProps) {
  const { toast } = useToast()
  const [setExistingLeaderLoading, setSetExistingLeaderLoading] =
    React.useState(false)

  console.log('existingLeader', existingLeader)
  return (
    <>
      <LeaderCard
        leader={existingLeader}
        stateLeader={stateLeader}
        stateLeaderDistrict={stateLeaderDistrict}
      />
      {existingLeader && !stateLeader && (
        <Button
          className="mt-4 w-full"
          disabled={setExistingLeaderLoading}
          loading={setExistingLeaderLoading}
          onClick={async () => {
            setSetExistingLeaderLoading(true)
            const result = await serverSetExistingLeaderToOffice({
              rootLeaderPermaLink: existingLeader.permaLink,
              state,
              branch,
              district,
              jurisdiction,
              legislativeChamber,
              revalidatePath: `/psp-admin/states/${state.ref.id}/legislative`,
            })
            if (result.success) {
              onSuccess()
            } else {
              toast({
                title: 'Error',
                description: result.error,
              })
            }
            setSetExistingLeaderLoading(false)
          }}
        >
          {setExistingLeaderLoading
            ? 'Adding...'
            : 'Add existing leader to ' + district.name}
        </Button>
      )}
      {existingLeader && stateLeader && (
        <div className="mt-4">
          This leader must first be removed from their current office.
        </div>
      )}
    </>
  )
}
