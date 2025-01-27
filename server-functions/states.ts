'use server'

import {
  deleteDistrict,
  getDistrictLeaders,
  setNewStateDistrict,
} from '@/lib/firebase/firestore'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { District, NewDistrict, State } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function addNewDistrict(district: NewDistrict, state: State) {
  mustGetCurrentAdmin()

  await setNewStateDistrict(district, state)

  revalidatePath(
    '/psp-admin/states/' + state.ref.id.toLowerCase() + '/legislative',
  )

  return {
    success: true,
  }
}

type DeleteDistrictProps = {
  district: District
  state: State
  revalidatePath?: string
}

export async function serverDeleteDistrict({
  district,
  state,
  revalidatePath: path,
}: DeleteDistrictProps) {
  mustGetCurrentAdmin()

  const leaders = await getDistrictLeaders(district, state)

  if (leaders.length > 0) {
    return {
      success: false,
      error:
        'You cannot delete a district that has leaders, first remove those leaders from this district.',
    }
  }

  await deleteDistrict(district, state)

  if (path) {
    revalidatePath(path)
  }

  return {
    success: true,
  }
}
