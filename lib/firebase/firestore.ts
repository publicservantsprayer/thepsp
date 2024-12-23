import {
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore'
import { db } from '@/lib/firebase/firebase-admin'

import { StateCode } from '@/data/states'
// import { getAuthenticatedAppForUser } from './server-app'
import { Leader, LeaderDbType } from '../leader'

type GetLeaders = (args: { stateCode: StateCode }) => Promise<Leader[]>

export const getLeaders: GetLeaders = async ({ stateCode }) => {
  // const { db } = await getAuthenticatedAppForUser()

  const LeaderConverter: FirestoreDataConverter<Leader> = {
    fromFirestore: (snapshot: QueryDocumentSnapshot<LeaderDbType>) => {
      const data = snapshot.data()
      return {
        ...data,
        lastImportDate: data.lastImportDate.toDate(),
        id: snapshot.id,
      }
    },
    toFirestore: (leader) => {
      delete leader.id
      return leader
    },
  }

  console.log({ stateCode })
  const collectionRef = db.collection(`/states/${stateCode}/leaders/`)
  const querySnapshot = await collectionRef.withConverter(LeaderConverter).get()
  // const querySnapshot = await collectionRef.get()
  if (querySnapshot.empty) {
    console.log('No matching documents.')
    return []
  }

  return querySnapshot.docs.map((doc) => doc.data())
}
