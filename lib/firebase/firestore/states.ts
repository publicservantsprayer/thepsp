import {
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore'
import { db } from '@/lib/firebase/server/admin-app'
import { State, StateCode, StateDb } from '@/lib/types'
import { stateDbParser, stateDbSchema, stateSchema } from './states.schema'

const StateConverter: FirestoreDataConverter<State> = {
  fromFirestore: (snapshot: QueryDocumentSnapshot<StateDb>) => {
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
      ref: snapshot.ref,
    }
  },
  toFirestore: (doc) => {
    return stateDbParser.parse(doc)
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

export const getStateByStateCode = async (stateCode: StateCode) => {
  const docRef = db.collection('states').doc(stateCode)
  const docSnapshot = await docRef.withConverter(StateConverter).get()
  const state = docSnapshot.data()
  if (!state) {
    throw new Error('State not found for stateCode: ' + stateCode)
  }

  return state
}

export const updateState = async (state: State) => {
  const updatedState = stateSchema.parse(state)

  return db
    .collection('states')
    .withConverter(StateConverter)
    .doc(state.id)
    .set(updatedState, { merge: true })
}

// export const updateAllStates = async () => {
//   const states = await getStates()
//   await Promise.all(
//     states.map((state) => {
//       if (['AZ', 'MN', 'NH', 'OR', 'WY'].includes(state.id)) {
//         state.hasLieutenantGovernor = false
//       } else {
//         state.hasLieutenantGovernor = true
//       }
//       if (['AL', 'HI', 'UT'].includes(state.id)) {
//         state.hasSecretaryOfState = false
//       } else {
//         state.hasSecretaryOfState = true
//       }
//       console.log('Updating state:', state.id)
//       return db
//         .collection('states')
//         .doc(state.id)
//         .withConverter(StateConverter)
//         .set(state, { merge: true })
//     }),
//   )
// }
