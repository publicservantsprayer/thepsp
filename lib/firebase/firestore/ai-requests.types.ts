import { Timestamp } from 'firebase-admin/firestore'

export interface AiRequestDbType {
  id: string
  query: string
  response: unknown
  type: 'executive'
  stateCode: string
  model: string
  createdAt: Timestamp
}

export interface AiRequest extends Omit<AiRequestDbType, 'createdAt'> {
  id: string
  createdAt: Date
}
