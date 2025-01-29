'use server'

import {
  deleteLeaderFromRootCollection,
  deleteLeaderFromStateCollectionOnly,
} from '@/lib/firebase/firestore'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { Leader, State } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export const serverDeleteStateLeader = async ({
  leader,
  state,
  revalidatePath: path,
}: {
  leader: Leader
  state: State
  revalidatePath?: string
}) => {
  mustGetCurrentAdmin()

  await deleteLeaderFromStateCollectionOnly({ leader, state })

  if (path) {
    revalidatePath(path)
  }

  return { success: true }
}

export const serverDeleteStateAndRootLeader = async ({
  leader,
  state,
  revalidatePath: path,
}: {
  leader: Leader
  state: State
  revalidatePath?: string
}) => {
  mustGetCurrentAdmin()

  await Promise.all([
    deleteLeaderFromStateCollectionOnly({ leader, state }),
    deleteLeaderFromRootCollection(leader),
  ])

  if (path) {
    revalidatePath(path)
  }

  return { success: true }
}
