'use server'

import {
  saveNewLeaderToStateAndRootCollection,
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

  if (leader.stateExecutiveOffice === 'governor') {
    if (state.governorRef) throw new Error('State already has a governor')

    const { savedRootLeader } = await saveNewLeaderToStateAndRootCollection({
      newLeader: leader,
      state,
    })
    await updateState(state, { governorRef: savedRootLeader.ref })
  } else if (leader.stateExecutiveOffice === 'lieutenant-governor') {
    if (state.lieutenantGovernorRef)
      throw new Error('State already has a lieutenant governor')

    const { savedRootLeader } = await saveNewLeaderToStateAndRootCollection({
      newLeader: leader,
      state,
    })
    await updateState(state, { lieutenantGovernorRef: savedRootLeader.ref })
  } else if (leader.stateExecutiveOffice === 'secretary-of-state') {
    if (state.secretaryOfStateRef)
      throw new Error('State already has a secretary of state')

    const { savedRootLeader } = await saveNewLeaderToStateAndRootCollection({
      newLeader: leader,
      state,
    })
    await updateState(state, { secretaryOfStateRef: savedRootLeader.ref })
  }

  if (path) {
    revalidatePath(path)
  }

  return { success: true }
}
