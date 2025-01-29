'use server'

import { saveNewLeaderToStateCollection } from '@/lib/firebase/firestore'
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

  const newLeader = await saveNewLeaderToStateCollection(leader, state)

  if (path) {
    revalidatePath(path)
  }

  return { success: true, newLeader }
}
