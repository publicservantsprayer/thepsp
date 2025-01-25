'use server'

import {
  saveNewLeaderToStateCollection,
  updateState,
} from '@/lib/firebase/firestore'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { NewLeader, State } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export const saveNewExecutiveStateLeader = async (
  leader: NewLeader,
  state: State,
) => {
  mustGetCurrentAdmin()

  if (leader.jurisdiction !== 'state' || leader.branch !== 'executive') {
    throw new Error('Leader is not a state executive')
  }

  const savedLeader = await saveNewLeaderToStateCollection(leader)

  if (leader.stateExecutiveOffice === 'governor') {
    await updateState(state, { governorRef: savedLeader.ref })
  } else if (leader.stateExecutiveOffice === 'lieutenant-governor') {
    await updateState(state, { lieutenantGovernorRef: savedLeader.ref })
  } else if (leader.stateExecutiveOffice === 'secretary-of-state') {
    await updateState(state, { secretaryOfStateRef: savedLeader.ref })
  } else {
    throw new Error(
      'Leader does not hold a state executive office: ' +
        leader.stateExecutiveOffice,
    )
  }
  revalidatePath('/psp-admin/states')

  return { success: true }
}
