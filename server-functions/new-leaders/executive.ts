'use server'

import {
  getStateByStateCode,
  saveNewLeaderToStateCollection,
} from '@/lib/firebase/firestore'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import {
  Leader,
  LeaderAiQuery,
  LeaderDb,
  NewLeader,
  StateCode,
} from '@/lib/types'

export const saveNewExecutiveStateLeader = async (
  leaderData: LeaderAiQuery,
  stateCode: StateCode,
) => {
  mustGetCurrentAdmin()

  if (
    leaderData.jurisdiction !== 'state' ||
    leaderData.branch !== 'executive'
  ) {
    throw new Error('Leader is not a state executive')
  }
  const leader: NewLeader = {
    ...leaderData,
    stateCode,
    lastImportDate: new Date(),
    hasPhoto: false,
  }

  const savedLeader = await saveNewLeaderToStateCollection(leader)
  const state = await getStateByStateCode(stateCode)

  if (leader.stateExecutiveOffice === 'governor') {
    await state.ref.update({ governorRef: savedLeader.ref })
  } else if (leader.stateExecutiveOffice === 'lieutenant-governor') {
    await state.ref.update({ lieutenantGovernorRef: savedLeader.ref })
  } else if (leader.stateExecutiveOffice === 'secretary-of-state') {
    await state.ref.update({ secretaryOfStateRef: savedLeader.ref })
  } else {
    throw new Error(
      'Leader does not hold a state executive office: ' +
        leader.stateExecutiveOffice,
    )
  }

  return savedLeader
}
