import { z } from 'zod'
import {
  stateCodeSchema,
  stateDbSchema,
  stateDtoSchema,
  stateSchema,
} from './states.schema'

export type State = z.infer<typeof stateSchema>
export type StateDb = z.infer<typeof stateDbSchema>
export type StateCode = z.infer<typeof stateCodeSchema>
