import { DocumentReference } from 'firebase-admin/firestore'
import { LeaderDbType } from './leaders.types'
import { z } from 'zod'
import { StateCodeSchema } from './states.schema'

export interface StateDbType {
  name: string
  region: string
  governorRef?: DocumentReference<FirebaseFirestore.DocumentData, LeaderDbType>
  hasLieutenantGovernor: boolean
  lieutenantGovernorRef?: DocumentReference<
    FirebaseFirestore.DocumentData,
    LeaderDbType
  >
  hasSecretaryOfState: boolean
  secretaryOfStateRef?: DocumentReference<
    FirebaseFirestore.DocumentData,
    LeaderDbType
  >
}

export interface StateDto
  extends Omit<
    StateDbType,
    'governorRef' | 'lieutenantGovernorRef' | 'secretaryOfStateRef'
  > {
  governorRef?: string
  lieutenantGovernorRef?: string
  secretaryOfStateRef?: string
  id: StateCode
}
export interface State extends StateDbType {
  id: StateCode
  dto: StateDto
}

export type StateCode = z.infer<typeof StateCodeSchema>
