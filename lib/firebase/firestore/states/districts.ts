import { District, DistrictDb, NewDistrict, State } from '@/lib/types'
import { db } from '../../server/admin-app'
import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  WithFieldValue,
} from 'firebase-admin/firestore'
import { districtDbParser } from './districts.schema'

export const DistrictConverter: FirestoreDataConverter<District> = {
  fromFirestore: (snapshot: QueryDocumentSnapshot<DistrictDb>): District => {
    const data = snapshot.data()
    return {
      ...data,
      ref: {
        id: snapshot.id,
        path: snapshot.ref.path,
      },
    }
  },
  toFirestore: (district: WithFieldValue<District>) => {
    return districtDbParser.parse(district)
  },
}

export const getDistricts = async (state: State) => {
  const collectionRef = db
    .collection('states')
    .doc(state.ref.id)
    .collection('districts')
    .orderBy('name')
    .withConverter(DistrictConverter)

  const stateSnapshot = await collectionRef.get()

  return stateSnapshot.docs.map((doc) => doc.data())
}

export const setNewStateDistrict = async (
  district: NewDistrict,
  state: State,
) => {
  const collectionRef = db
    .collection('states')
    .doc(state.ref.id)
    .collection('districts')
    .withConverter(DistrictConverter)

  const newDistrictDocRef = await collectionRef.add(district as District)

  return newDistrictDocRef
}
