'use client'

import { LeaderForm } from '@/components/psp-admin/leader-form'
import { useToast } from '@/components/hooks/use-toast'
import { serverSaveNewStateLeader } from '@/server-functions/new-leaders/new-state-leader'
import {
  District,
  Jurisdiction,
  LeaderAiQuery,
  LegislativeChamber,
  NewLeader,
  NewLeaderForm as NewLeaderFormType,
  State,
} from '@/lib/types'
import React from 'react'

export function NewLeaderForm({
  state,
  district,
  jurisdiction,
  legislativeChamber,
  setOpen,
  aiResult,
}: {
  state: State
  district: District
  jurisdiction: Jurisdiction
  legislativeChamber: LegislativeChamber
  setOpen: (open: boolean) => void
  aiResult: LeaderAiQuery | undefined
}) {
  const { toast } = useToast()

  const onSubmit = async (leaderFormData: NewLeaderFormType) => {
    const newLeader: NewLeader = {
      ...leaderFormData,
      jurisdiction,
      branch: 'legislative',
      legislativeChamber,
      districtRef: district.ref,
      StateCode: state.ref.id,
    }

    const result = await serverSaveNewStateLeader({
      leader: newLeader,
      state,
      revalidatePath: `/psp-admin/states/${state.ref.id.toLowerCase()}/legislative`,
    })
    if (result.success) {
      toast({
        title: 'Success',
        description:
          result.savedRootLeader.fullname + ' info saved successfully.',
      })
      setOpen(false)
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save leader info.',
      })
    }
  }

  return (
    <div className="col-span-1">
      <LeaderForm leader={aiResult} onSubmit={onSubmit} />
    </div>
  )
}
