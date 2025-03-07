'use server'

import { getRootLeaderById } from '@/lib/firebase/firestore'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { revalidatePath } from 'next/cache'

export const serverGetRootLeader = async ({
  leaderId,
  revalidatePath: path,
}: {
  leaderId: string
  revalidatePath?: string
}) => {
  mustGetCurrentAdmin()

  const rootLeader = await getRootLeaderById(leaderId)
  if (!rootLeader) {
    console.error('Leader not found with id: ' + leaderId)
    return {
      success: false,
      error: 'Leader not found with id: ' + leaderId,
    }
  }

  if (path) {
    revalidatePath(path)
  }

  return { success: true, rootLeader }
}
