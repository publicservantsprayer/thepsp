'use server'

import { State } from '@/lib/types'
import { updateState } from '@/lib/firebase/firestore/states'
import { revalidatePath } from 'next/cache'

interface SaveStateSettingsParams {
  state: State
  createDailyPost: boolean
  hasLieutenantGovernor: boolean
  hasSecretaryOfState: boolean
  lowerChamberName: string
  upperChamberName: string
  revalidatePath?: string
}

export async function serverSaveStateSettings({
  state,
  createDailyPost,
  hasLieutenantGovernor,
  hasSecretaryOfState,
  lowerChamberName,
  upperChamberName,
  revalidatePath: path,
}: SaveStateSettingsParams) {
  try {
    await updateState(state, {
      createDailyPost,
      hasLieutenantGovernor,
      hasSecretaryOfState,
      lowerChamberName,
      upperChamberName,
    })

    if (path) {
      revalidatePath(path)
    }

    return { success: true }
  } catch (error) {
    console.error('Error saving state settings:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
