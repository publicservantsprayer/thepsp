import React from 'react'

import {
  getRootLeaderById,
  getStateLeaders,
  getStates,
} from '@/lib/firebase/firestore'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { ExpandableContainer } from '@/components/psp-admin/expandable-container'
import { VerifyRootLeaders } from './verify-root-leaders'
import { State } from '@/lib/types'

export default async function LeadersPage() {
  await mustGetCurrentAdmin()

  const states = await getStates()

  const verifyRootLeadersForState = async (state: State) => {
    'use server'
    const stateLeaders = await getStateLeaders({ stateCode: state.ref.id })
    let missingRootLeaders = 0
    for (const stateLeader of stateLeaders) {
      const rootLeader = await getRootLeaderById(stateLeader.ref.id)
      if (!rootLeader) {
        missingRootLeaders++
      }
    }
    return (
      `Verified ${stateLeaders.length} leaders for state ${state.name}.` +
      ` ${missingRootLeaders} missing root leaders.`
    )
  }

  return (
    <ExpandableContainer title="Superadmin Data">
      <VerifyRootLeaders
        states={states}
        verifyRootLeadersForState={verifyRootLeadersForState}
      />
    </ExpandableContainer>
  )
}
