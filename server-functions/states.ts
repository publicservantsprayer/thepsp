'use server'

import { setNewStateDistrict } from '@/lib/firebase/firestore'
import { NewDistrict, State } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function addNewDistrict(district: NewDistrict, state: State) {
  const result = await setNewStateDistrict(district, state)

  revalidatePath(
    '/psp-admin/states/' + state.ref.id.toLowerCase() + '/legislative',
  )

  return {
    success: true,
  }
}
