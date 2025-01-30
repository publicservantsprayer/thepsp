'use server'

import { saveLeader } from '@/lib/firebase/firestore'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { Leader } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export const serverSaveLeader = async ({
  leader,
  revalidatePath: path,
}: {
  leader: Leader
  revalidatePath?: string
}) => {
  mustGetCurrentAdmin()

  try {
    await saveLeader({ leader })
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }

  if (path) {
    revalidatePath(path)
  }

  return { success: true }
}
