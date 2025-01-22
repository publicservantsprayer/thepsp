import {
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore'
import { db } from '@/lib/firebase/server/admin-app'

import type { Leader, LeaderDbType, StateCode } from '@/lib/types'
import { PostConverter } from './posts'

type GetLeaders = (args: { stateCode: StateCode }) => Promise<Leader[]>

export const LeaderConverter: FirestoreDataConverter<Leader> = {
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

export const getLeaders: GetLeaders = async ({ stateCode }) => {
  const collectionRef = db
    .collection('states')
    .doc(stateCode)
    .collection('leaders')
  const querySnapshot = await collectionRef.withConverter(LeaderConverter).get()
  if (querySnapshot.empty) {
    console.error('No matching leaders.')
    return []
  }

  return querySnapshot.docs.map((doc) => doc.data())
}

export const getLeadersWithoutPhoto = async (stateCode: StateCode) => {
  const collectionRef = db
    .collection('states')
    .doc(stateCode)
    .collection('leaders')
    .withConverter(LeaderConverter)
    .where('hasPhoto', '==', false)
  const querySnapshot = await collectionRef.withConverter(LeaderConverter).get()
  if (querySnapshot.empty) {
    return []
  }

  return querySnapshot.docs.map((doc) => doc.data())
}

export const getOrderedLeadersForDailyPost = async (stateCode: StateCode) => {
  // console.log('getOrderedLeadersForDailyPost', stateCode)
  const postSnapshot = await db
    .collection('states')
    .doc(stateCode)
    .collection('posts')
    .withConverter(PostConverter)
    .orderBy('dateID', 'desc')
    .limit(1)
    .get()

  if (postSnapshot.empty) {
    throw new Error('No post found for state: ' + stateCode)
  }

  const leadersSnapshot = await db
    .collection('states')
    .doc(stateCode)
    .collection('leaders')
    .withConverter(LeaderConverter)
    .orderBy('LastName')
    .orderBy('PID')
    .get()

  if (leadersSnapshot.empty) {
    throw new Error('No leaders found for state: ' + stateCode)
  }

  // rotate the leaders so that the post's leader3 is last and the rest are in order
  const leaderDocs = leadersSnapshot.docs.map((doc) => doc.data())
  const latestPost = postSnapshot.docs[0].data()
  const leader3 = leaderDocs.find(
    (leader) => leader.PID === latestPost.leader3.PID,
  )
  if (!leader3) {
    throw new Error(
      'No leader3 found for ' + stateCode + ' post: ' + latestPost.id,
    )
  }
  const leader3Index = leaderDocs.indexOf(leader3)
  const rotatedLeaders = [
    ...leaderDocs.slice(leader3Index + 1),
    ...leaderDocs.slice(0, leader3Index),
  ]

  return rotatedLeaders
}

export const getCollectionGroupLeaderByPermaLink = async (
  permaLink: string,
) => {
  const doc = await db
    .collectionGroup('leaders')
    .withConverter(LeaderConverter)
    .where('permaLink', '==', permaLink)
    .get()
  if (doc.empty) {
    throw new Error(
      'No collectionGroup leader exists with permaLink: ' + permaLink,
    )
  }
  return doc.docs[0].data()
}

export const getRootLeaderById = async (id: string) => {
  const doc = await db
    .collection('leaders')
    .withConverter(LeaderConverter)
    .doc(id)
    .get()
  if (doc.exists) {
    throw new Error('No root leader exists with id: ' + id)
  }
  return doc.data()
}

export const mergeUpdateStateLeaderById = async ({
  id,
  stateCode,
  data,
}: {
  id: string
  stateCode: StateCode
  data: Partial<Leader>
}) => {
  const doc = db
    .collection('states')
    .doc(stateCode)
    .collection('leaders')
    .doc(id)
  await doc.set(data, { merge: true })
}
