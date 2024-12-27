import { states } from '@/data/states'
import type { StateCode } from '@/lib/types'

// Uppercase, two-letter state codes
const stateCodes = Object.keys(states)
const fallBackStateCode: StateCode = 'TX'

export const validateStateCode = (stateCode?: string) => {
  return stateCode && stateCodes.includes(stateCode)
}

export const makeValidStateCode = (stateCode?: string) => {
  stateCode = stateCode?.toUpperCase()
  if (validateStateCode(stateCode)) return stateCode as StateCode
  else return fallBackStateCode as StateCode
}

export const getStateInfo = (stateCode: StateCode) => {
  return {
    stateCode,
    lowerCaseStateCode: stateCode.toLowerCase(),
    stateName: states[stateCode],
    stateNameFromStateCode: (stateCode: StateCode) => states[stateCode],
    states,
    facebookPage: `PSP${states[stateCode].split(' ').join('')}`,
  }
}
