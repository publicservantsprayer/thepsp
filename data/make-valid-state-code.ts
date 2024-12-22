import { states, StateCode } from '@/data/states'

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
