'use server'

import { NewLeaderForm } from '@/components/psp-admin/leader-form'
import { saveNewLeaderToStateCollection } from '@/lib/firebase/firestore'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { State } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export const serverSaveNewStateLeader = async ({
  leader,
  state,
  revalidatePath: path,
}: {
  leader: NewLeaderForm
  state: State
  revalidatePath?: string
}) => {
  mustGetCurrentAdmin()

  const newLeader = await saveNewLeaderToStateCollection(
    { ...leader, StateCode: state.ref.id },
    state,
  )

  if (path) {
    revalidatePath(path)
  }

  return { success: true, newLeader }
}
