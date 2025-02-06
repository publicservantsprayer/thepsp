'use server'

import { saveNewLeaderToStateAndRootCollection } from '@/lib/firebase/firestore'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { NewLeader, State } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export const serverSaveNewStateLeader = async ({
  leader,
  state,
  revalidatePath: path,
}: {
  leader: NewLeader
  state: State
  revalidatePath?: string
}) => {
  mustGetCurrentAdmin()

  const { savedRootLeader } = await saveNewLeaderToStateAndRootCollection({
    newLeader: leader,
    state,
  })

  if (path) {
    revalidatePath(path)
  }

  return { success: true, savedRootLeader }
}
