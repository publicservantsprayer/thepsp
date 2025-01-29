'use server'

import {
  saveNewLeaderToStateCollection,
  updateState,
} from '@/lib/firebase/firestore'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { NewLeader, State } from '@/lib/types'
import { revalidatePath } from 'next/cache'

// TODO: should this be combined with the other saveNewStateLeader function?
export const serverSaveNewExecutiveStateLeader = async ({
  leader,
  state,
  revalidatePath: path,
}: {
  leader: NewLeader
  state: State
  revalidatePath?: string
}) => {
  mustGetCurrentAdmin()

  if (leader.jurisdiction !== 'state' || leader.branch !== 'executive') {
    throw new Error('Leader is not a state executive')
  }

  let savedLeader

  if (leader.stateExecutiveOffice === 'governor') {
    if (state.governorRef) throw new Error('State already has a governor')

    savedLeader = await saveNewLeaderToStateCollection(leader, state)
    await updateState(state, { governorRef: savedLeader.ref })
  } else if (leader.stateExecutiveOffice === 'lieutenant-governor') {
    if (state.lieutenantGovernorRef)
      throw new Error('State already has a lieutenant governor')

    savedLeader = await saveNewLeaderToStateCollection(leader, state)
    await updateState(state, { lieutenantGovernorRef: savedLeader.ref })
  } else if (leader.stateExecutiveOffice === 'secretary-of-state') {
    if (state.secretaryOfStateRef)
      throw new Error('State already has a secretary of state')

    savedLeader = await saveNewLeaderToStateCollection(leader, state)
    await updateState(state, { secretaryOfStateRef: savedLeader.ref })
  }

  if (path) {
    revalidatePath(path)
  }

  return { success: true }
}
