import {
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore'
import { db } from '@/lib/firebase/server/admin-app'
import { State, StateCode, StateDbType } from '@/lib/types'

const StateConverter: FirestoreDataConverter<State> = {
  fromFirestore: (snapshot: QueryDocumentSnapshot<StateDbType>) => {
    const data = snapshot.data()
    const dto = {
      ...data,
      id: snapshot.id as StateCode,
      governorRef: data.governorRef?.path,
      lieutenantGovernorRef: data.lieutenantGovernorRef?.path,
      secretaryOfStateRef: data.secretaryOfStateRef?.path,
    }
    return {
      ...data,
      id: snapshot.id as StateCode,
      dto,
    }
  },
  toFirestore: (doc) => {
    delete doc.id
    return doc
  },
}

export const getStates = async () => {
  const collectionRef = db.collection('states')
  const querySnapshot = await collectionRef.withConverter(StateConverter).get()
  if (querySnapshot.empty) {
    console.error('No matching states.')
    return []
  }

  return querySnapshot.docs.map((doc) => doc.data())
}
