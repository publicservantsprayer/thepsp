'use server'

import { getStateLeaderById } from '@/lib/firebase/firestore'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { StateCode } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export const serverGetStateLeader = async ({
  leaderId,
  stateCode,
  revalidatePath: path,
}: {
  leaderId: string
  stateCode: StateCode
  revalidatePath?: string
}) => {
  mustGetCurrentAdmin()

  const stateLeader = await getStateLeaderById(leaderId, stateCode)

  if (path) {
    revalidatePath(path)
  }

  return { success: true, stateLeader }
}
