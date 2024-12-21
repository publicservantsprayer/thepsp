import { useUSAState } from '@/hooks/use-usa-state'

export function useHomePath() {
  const { stateCode } = useUSAState({ useGeoCode: true })

  if (stateCode) return `/states/${stateCode.toLowerCase()}`
  else return '/'
}
