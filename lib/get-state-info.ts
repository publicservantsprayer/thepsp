import { states, stateCodes } from '@/data/states'
import type { StateCode } from '@/lib/types'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

type ValidateStateCode = (code?: string) => StateCode | undefined

export const validateStateCode: ValidateStateCode = (code) => {
  if (!code) return

  const stateCode = code.toUpperCase()

  if (stateCodes.includes(stateCode)) {
    return stateCode as StateCode
  }
}

/**
 * Turns a lower or uppercase state code into a valid StateCode type
 */
type MakeValidStateCode = (code?: string) => StateCode

export const makeValidStateCode: MakeValidStateCode = (code) => {
  const stateCode = validateStateCode(code)

  if (!stateCode) {
    throw new Error(`Invalid state code: ${stateCode}`)
  }

  return stateCode as StateCode
}

/**
 * Get static state information from a StateCode
 */
export const getStateInfo = (stateCode: StateCode) => {
  const lowerCaseStateCode = stateCode.toLowerCase()
  const stateName = states[stateCode]
  let facebookPage = `PSP${stateName.split(' ').join('')}`

  if (stateCode === 'AL') {
    facebookPage = `${stateName.split(' ').join('')}PSP`
  }

  return {
    stateCode,
    lowerCaseStateCode,
    homePath: `/states/${lowerCaseStateCode}`,
    stateName: states[stateCode],
    states,
    facebookPage,
  }
}

/**
 * Get the state code from the server cookie
 * @returns Promise<StateCode | undefined>
 */
export const getStateCodeFromServerCookie: (
  cookies: () => Promise<ReadonlyRequestCookies>,
) => Promise<StateCode | undefined> = async (cookies) => {
  const cookieStore = await cookies()
  const cookieStateCode = cookieStore.get('stateCode')
  const stateCode = cookieStateCode?.value.toUpperCase()

  if (!validateStateCode(stateCode)) {
    return
  }

  return makeValidStateCode(stateCode)
}

/**
 * Get the state code from the client cookie
 * @returns StateCode or undefined
 */
export const getStateCodeFromClientCookie: () => StateCode | undefined = () => {
  if (typeof window !== 'undefined') {
    const cookieStateCode = document.cookie
      .split('; ')
      .find((row) => row.startsWith('stateCode='))
      ?.split('=')[1]
    const stateCode = cookieStateCode?.toUpperCase()

    if (!validateStateCode(stateCode)) {
      return
    }

    return makeValidStateCode(stateCode)
  }
}
