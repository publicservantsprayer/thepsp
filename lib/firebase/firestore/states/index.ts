import {
  QueryDocumentSnapshot,
  FirestoreDataConverter,
  Timestamp,
} from 'firebase-admin/firestore'
import { db } from '@/lib/firebase/server/admin-app'
import { State, StateCode, StateDb } from '@/lib/types'
import { stateDbParser } from './states.schema'

const StateConverter: FirestoreDataConverter<State, StateDb> = {
  fromFirestore: (snapshot: QueryDocumentSnapshot<StateDb>) => {
    const data = snapshot.data()
    return {
      ...data,
      ref: {
        id: snapshot.id as StateCode,
        path: snapshot.ref.path,
      },
      updatedAt:
        data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate()
          : data.updatedAt,
      governorRef: data.governorRef && {
        id: data.governorRef.id,
        path: data.governorRef.path,
      },
      lieutenantGovernorRef: data.lieutenantGovernorRef && {
        id: data.lieutenantGovernorRef.id,
        path: data.lieutenantGovernorRef.path,
      },
      secretaryOfStateRef: data.secretaryOfStateRef && {
        id: data.secretaryOfStateRef.id,
        path: data.secretaryOfStateRef.path,
      },
      usSenateName: 'U.S. Senate',
      usSenateFullname: 'United States Senate',
      usHouseName: 'U.S. House',
      usHouseFullname: 'United States House of Representatives',
    }
  },
  toFirestore: (state: State) => {
    if (state.governorRef) {
      state.governorRef = db.collection('leaders').doc(state.governorRef.id)
    }
    if (state.lieutenantGovernorRef) {
      state.lieutenantGovernorRef = db
        .collection('leaders')
        .doc(state.lieutenantGovernorRef.id)
    }
    if (state.secretaryOfStateRef) {
      state.secretaryOfStateRef = db
        .collection('leaders')
        .doc(state.secretaryOfStateRef.id)
    }
    return stateDbParser.parse(state)
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

export const getState = async (stateCode: StateCode) => {
  const docRef = db.collection('states').doc(stateCode)
  const docSnapshot = await docRef.withConverter(StateConverter).get()
  return docSnapshot.data()
}

export const mustGetState = async (stateCode: StateCode) => {
  const state = await getState(stateCode)
  if (!state) {
    throw new Error('State not found for stateCode: ' + stateCode)
  }

  return state
}

export const updateState = async (state: State, data: Partial<State>) => {
  data.updatedAt = new Date()
  return db
    .collection('states')
    .doc(state.ref.id)
    .withConverter(StateConverter)
    .update(data)
}

// Use this to update all states

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
