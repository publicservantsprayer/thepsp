import {
  QueryDocumentSnapshot,
  FirestoreDataConverter,
  WithFieldValue,
} from 'firebase-admin/firestore'
import { db } from '@/lib/firebase/server/admin-app'

import type { Leader, LeaderDb, NewLeader, StateCode } from '@/lib/types'
import { PostConverter } from './posts'
import { leaderDbParser } from './leaders.schema'

type GetLeaders = (args: { stateCode: StateCode }) => Promise<Leader[]>

export const LeaderConverter: FirestoreDataConverter<Leader, LeaderDb> = {
  fromFirestore: (snapshot: QueryDocumentSnapshot<LeaderDb>): Leader => {
    const data = snapshot.data()
    const dto = {
      ...data,
      id: snapshot.id,
      lastImportDate: data.lastImportDate.toDate(),
    }
    return {
      ...data,
      lastImportDate: data.lastImportDate.toDate(),
      id: snapshot.id,
      dto,
      ref: snapshot.ref,
    }
  },
  toFirestore: (leader: WithFieldValue<Leader>) => {
    const dbLeader = leaderDbParser.parse(leader)
    return dbLeader
  },
}

export const saveNewLeader = async (leader: NewLeader) => {
  const savedLeaderDocRef = await db
    .collection('leaders')
    .withConverter(LeaderConverter)
    .add(leader as Leader)

  const savedLeaderSnapshot = await savedLeaderDocRef
    .withConverter(LeaderConverter)
    .get()

  const savedLeader = savedLeaderSnapshot.data()

  if (!savedLeader) {
    throw new Error('Failed to save leader')
  }

  const permaLinkName = `${savedLeader.LastName}-${savedLeader.FirstName}`
    .replace(/[^a-z0-9-]+/gi, '')
    .toLowerCase()

  const permaLink = [permaLinkName, savedLeader.id].join('-')
  savedLeader.permaLink = permaLink

  await db.collection('leaders').doc(savedLeader.id).update(savedLeader)

  return savedLeader
}

export const saveNewLeaderToStateCollection = async (leader: NewLeader) => {
  const savedLeader = await saveNewLeader(leader)
  await db
    .collection('states')
    .doc(leader.stateCode)
    .collection('leaders')
    .doc(savedLeader.id)
    .set({ permaLink: leader.permaLink }, { merge: true })

  return savedLeader
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
    (leader) => leader.id === latestPost.leader3.id,
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
