'use server'

import { makeValidStateCode } from '@/data/make-valid-state-code'
import type { StateCode } from '@/lib/types'
import { cookies } from 'next/headers'

export const updateCookieStateCode = async (stateCode: StateCode) => {
  const cookieStore = await cookies()

  cookieStore.set('stateCode', makeValidStateCode(stateCode))
}
