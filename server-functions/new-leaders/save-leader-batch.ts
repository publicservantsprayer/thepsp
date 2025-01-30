'use server'

import { saveLeaderBatch } from '@/lib/firebase/firestore'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { Leader } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export const serverSaveLinedUpLeaders = async ({
  leaders,
  revalidatePath: path,
}: {
  leaders: Leader[]
  revalidatePath?: string
}) => {
  mustGetCurrentAdmin()

  let results
  try {
    results = await saveLeaderBatch({ leaders })
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }

  if (path) {
    revalidatePath(path)
  }

  return { success: true, count: results.length }
}
