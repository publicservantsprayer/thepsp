import {
  QueryDocumentSnapshot,
  FirestoreDataConverter,
  WithFieldValue,
  Timestamp,
} from 'firebase-admin/firestore'
import { db } from '@/lib/firebase/server/admin-app'

import type { Leader, LeaderDb, NewLeader, StateCode } from '@/lib/types'
import { PostConverter } from './posts'
import { leaderDbParser } from './leaders.schema'

type GetLeaders = (args: { stateCode: StateCode }) => Promise<Leader[]>

export const LeaderConverter: FirestoreDataConverter<Leader, LeaderDb> = {
  fromFirestore: (snapshot: QueryDocumentSnapshot<LeaderDb>): Leader => {
    const data = snapshot.data()
    return {
      ...data,
      ref: {
        id: snapshot.id,
        // The source of truth is always the root leader
        // so we use the manually use the root path, even if we got this
        // leader from a state subcollection
        path: `leaders/${snapshot.id}`,
      },
      lastImportDate:
        data.lastImportDate instanceof Timestamp
          ? data.lastImportDate.toDate()
          : data.lastImportDate,
      fullname: [data.FirstName, data.LastName].join(' '),
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

  console.log('path', savedLeaderSnapshot.ref.path)

  const savedLeader = savedLeaderSnapshot.data()

  if (!savedLeader) {
    throw new Error('Failed to save leader')
  }

  const permaLinkName = `${savedLeader.LastName}-${savedLeader.FirstName}`
    .split('')
    .filter((char) => /[a-z0-9-]/i.test(char))
    .join('')
    .toLowerCase()

  const permaLink = [permaLinkName, savedLeader.ref.id].join('-')
  savedLeader.permaLink = permaLink

  // console.log({ permaLink })

  await db.collection('leaders').doc(savedLeader.ref.id).update(savedLeader)

  return savedLeader
}

export const saveNewLeaderToStateCollection = async (leader: NewLeader) => {
  const savedLeader = await saveNewLeader(leader)

  // console.log('savedLeader', savedLeader)
  await db
    .collection('states')
    .doc(savedLeader.StateCode)
    .collection('leaders')
    .withConverter(LeaderConverter)
    .doc(savedLeader.ref.id)
    .create(savedLeader)
  console.log('saved leader in states')

  return savedLeader
}

export const getLeader = async (leaderRef?: Leader['ref']) => {
  if (!leaderRef) return

  const docRef = db.doc(leaderRef.path).withConverter(LeaderConverter)
  const docSnapshot = await docRef.get()

  return docSnapshot.data()
}

export const mustGetLeader = async (leaderRef: Leader['ref']) => {
  const leader = await getLeader(leaderRef)

  if (!leader) {
    throw new Error('Leader not found for ref: ' + leaderRef.path)
  }

  return leader
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
    (leader) => leader.ref.id === latestPost.leader3.ref.id,
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

// get all leaders in baches of 250
// update each leader with the normalized data
// return the number of leaders updated
export const normalizeAllLeaders = async () => {
  const normalizeLeader = (leader: Leader): Leader => {
    // change something
    return leader
  }

  const batchSize = 250
  let lastDoc: QueryDocumentSnapshot | undefined = undefined
  let count = 0

  while (true) {
    let query = db
      .collection('leaders')
      .withConverter(LeaderConverter)
      .limit(batchSize)
    if (lastDoc) {
      query = query.startAfter(lastDoc)
    }

    const snapshot = await query.get()
    if (snapshot.empty) {
      break
    }

    const batch = db.batch()
    snapshot.docs.forEach((doc) => {
      const data = doc.data()
      const normalizedData = normalizeLeader(data)
      batch.set(doc.ref, normalizedData)
      count++
    })

    await batch.commit()
    lastDoc = snapshot.docs[snapshot.docs.length - 1]
  }

  return count
}
