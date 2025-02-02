'use server'

import { getState } from '@/lib/firebase/firestore'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { validateStateCode } from '@/lib/get-state-info'
import { StateCode } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export const serverGetState = async ({
  stateCode,
  revalidatePath: path,
}: {
  stateCode: StateCode
  revalidatePath?: string
}) => {
  mustGetCurrentAdmin()

  if (!validateStateCode(stateCode)) {
    return { success: false, error: `Invalid stateCode: ${stateCode}` }
  }

  const state = await getState(stateCode)

  if (!state) {
    return {
      success: false,
      error: `State not found for stateCode: ${stateCode}`,
    }
  }

  if (path) {
    revalidatePath(path)
  }

  return { success: true, state }
}
