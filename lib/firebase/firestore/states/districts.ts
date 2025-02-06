import {
  District,
  DistrictDb,
  NewDistrict,
  State,
  StateCode,
} from '@/lib/types'
import { db } from '../../server/admin-app'
import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  WithFieldValue,
} from 'firebase-admin/firestore'
import { districtDbParser } from './districts.schema'
import { LeaderConverter } from '../leaders'

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

export const getDistrict = async (districtId: string, stateCode: StateCode) => {
  const collectionRef = db
    .collection('states')
    .doc(stateCode)
    .collection('districts')
    .doc(districtId)
    .withConverter(DistrictConverter)

  const snapshot = await collectionRef.get()

  return snapshot.data()
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

export async function getDistrictLeaders(district: District, state: State) {
  const districtDocRef = db.doc(district.ref.path)

  const stateLeaderCollectionRef = db.doc(state.ref.path).collection('leaders')
  const snapshot = await stateLeaderCollectionRef
    .where('districtRef', '==', districtDocRef)
    .withConverter(LeaderConverter)
    .get()

  return snapshot.docs.map((doc) => doc.data())
}

export const deleteDistrict = async (district: District, state: State) => {
  const leaders = await getDistrictLeaders(district, state)

  if (leaders.length > 0) {
    throw new Error('District has leaders')
  }

  await db.doc(district.ref.path).delete()
}
