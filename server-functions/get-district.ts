'use server'

import { getDistrict } from '@/lib/firebase/firestore/states/districts'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { validateStateCode } from '@/lib/get-state-info'
import { StateCode } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export const serverGetDistrict = async ({
  districtId,
  stateCode,
  revalidatePath: path,
}: {
  districtId: string
  stateCode: StateCode
  revalidatePath?: string
}) => {
  mustGetCurrentAdmin()

  if (!validateStateCode(stateCode)) {
    return { success: false, error: `Invalid stateCode: ${stateCode}` }
  }

  const district = await getDistrict(districtId, stateCode)

  if (!district) {
    return {
      success: false,
      error: `District not found for districtId: ${districtId} and stateCode: ${stateCode}`,
    }
  }

  if (path) {
    revalidatePath(path)
  }

  return { success: true, district }
}
