import {
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore'
import { db } from '@/lib/firebase/server/admin-app'

import { AiRequest, AiRequestDbType } from './ai-requests.types'
import { StateCode } from '@/lib/types'

export const aiRequestConverter: FirestoreDataConverter<AiRequest> = {
  fromFirestore: (snapshot: QueryDocumentSnapshot<AiRequestDbType>) => {
    const data = snapshot.data()
    return {
      ...data,
      createdAt: data.createdAt.toDate(),
      id: snapshot.id,
    }
  },
  toFirestore: (doc) => {
    delete doc.id
    return doc
  },
}

export async function saveAiRequest({
  query,
  response,
  type,
  stateCode,
  model,
  createdAt,
}: {
  query: string
  response: unknown
  type: string
  stateCode: StateCode
  model: string
  createdAt: Date
}) {
  return db.collection('aiRequests').add({
    query,
    response,
    type,
    stateCode,
    model,
    createdAt,
  })
}

export const getAiRequests = async () => {
  const querySnapshot = await db.collection('ai-requests').get()
  if (querySnapshot.empty) {
    console.error('No matching ai requests.')
    return []
  }

  return querySnapshot.docs.map((doc) => doc.data())
}
