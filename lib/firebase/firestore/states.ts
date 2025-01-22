import {
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore'
import { db } from '@/lib/firebase/server/admin-app'
import { State, StateDbType } from '@/lib/types'

const StateConverter: FirestoreDataConverter<State> = {
  fromFirestore: (snapshot: QueryDocumentSnapshot<StateDbType>) => {
    const data = snapshot.data()
    return {
      ...data,
      id: snapshot.id,
    }
  },
  toFirestore: (leader) => {
    delete leader.id
    return leader
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
