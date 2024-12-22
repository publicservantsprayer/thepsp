'use server'

import { makeValidStateCode } from '@/data/make-valid-state-code'
import { StateCode } from '@/data/states'
import { cookies } from 'next/headers'

export const updateCookieStateCode = async (stateCode: StateCode) => {
  const cookieStore = await cookies()

  cookieStore.set('stateCode', makeValidStateCode(stateCode))
}
