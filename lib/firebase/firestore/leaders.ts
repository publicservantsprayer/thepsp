/**
 * Root Leaders
 * path: leaders/{leaderId}
 */

import {
  QueryDocumentSnapshot,
  FirestoreDataConverter,
  // WithFieldValue,
  Timestamp,
} from 'firebase-admin/firestore'
import { db } from '@/lib/firebase/server/admin-app'
import type { Leader, LeaderDb, NewLeader, State, StateCode } from '@/lib/types'
import { PostConverter } from './posts'
import { leaderDbSchema, leaderDbSuperRefine } from './leaders.schema'

/**
 * Used for transforming non-database fields in the FirestoreDataConverter.
 */
const leaderDbParser = leaderDbSchema
  .passthrough() // This allows us to pass through any fields that are not defined in the schema
  .superRefine(leaderDbSuperRefine)
  .transform((data) => {
    if (data.districtRef) {
      data.districtRef = db.doc(data.districtRef.path)
    } else {
      delete data.districtRef
    }
    delete (data as Partial<Leader>).ref
    delete (data as Partial<Leader>).fullname
    delete (data as Partial<Leader>).districtName
    return data
  })

export const LeaderConverter: FirestoreDataConverter<Leader> = {
  fromFirestore: (snapshot: QueryDocumentSnapshot<LeaderDb>): Leader => {
    const data = snapshot.data()
    return {
      ...data,
      ref: {
        id: snapshot.id,
        path: snapshot.ref.path,
      },
      districtRef: data.districtRef && {
        id: data.districtRef.id,
        path: data.districtRef.path,
      },
      lastImportDate:
        data.lastImportDate instanceof Timestamp
          ? data.lastImportDate.toDate()
          : data.lastImportDate,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : data.createdAt,
      updatedAt:
        data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate()
          : data.updatedAt,
      fullname: [data.FirstName, data.MidName, data.LastName].join(' '),
    }
  },
  toFirestore: (leader: Leader) => {
    leader.updatedAt = new Date()
    const dbLeader = leaderDbParser.parse(leader)
    return dbLeader
  },
}

export const saveNewRootLeader = async (leader: NewLeader) => {
  const date = new Date()
  leader.createdAt = date
  leader.lastImportDate = date
  leader.hasPhoto = false

  if (leader.districtRef) {
    const path = leader.districtRef.path
    leader.districtRef = db.doc(path)
  }

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
    .split('')
    .filter((char) => /[a-z0-9-]/i.test(char))
    .join('')
    .toLowerCase()

  const permaLink = [permaLinkName, savedLeader.ref.id].join('-')

  const rootLeaderDocRef = db
    .collection('leaders')
    .withConverter(LeaderConverter)
    .doc(savedLeader.ref.id)
  await rootLeaderDocRef.update({ permaLink })

  const rootLeaderSnapshot = await rootLeaderDocRef.get()
  const savedRootLeader = rootLeaderSnapshot.data()

  if (!savedRootLeader) {
    throw new Error('Failed to update root leader with permaLink')
  }
  return savedRootLeader
}

export const saveNewLeaderToStateCollection = async ({
  existingRootLeader,
  state,
}: {
  existingRootLeader: Leader
  state: State
}) => {
  // Reset the createdAt date to the current date
  existingRootLeader.createdAt = new Date()
  // Save a copy of the existing root leader to the state collection
  await db
    .collection('states')
    .doc(state.ref.id)
    .collection('leaders')
    .withConverter(LeaderConverter)
    .doc(existingRootLeader.ref.id)
    .create(existingRootLeader)

  const savedStateLeaderSnapshot = await db
    .collection('states')
    .doc(state.ref.id)
    .collection('leaders')
    .doc(existingRootLeader.ref.id)
    .get()

  const savedStateLeader = savedStateLeaderSnapshot.data()

  if (!savedStateLeader) {
    throw new Error('Failed to save state leader')
  }

  return savedStateLeader
}

export const saveNewLeaderToStateAndRootCollection = async ({
  newLeader,
  state,
}: {
  newLeader: NewLeader
  state: State
}) => {
  const savedRootLeader = await saveNewRootLeader(newLeader)

  const savedStateLeader = await saveNewLeaderToStateCollection({
    existingRootLeader: savedRootLeader,
    state,
  })

  return { savedRootLeader, savedStateLeader }
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
    throw new Error(
      'Leader not found for ref: ' +
        (leaderRef?.path || JSON.stringify(leaderRef)),
    )
  }

  return leader
}

export const getRootLeaderByPermaLink = async (permaLink: string) => {
  const doc = await db
    .collection('leaders')
    .where('permaLink', '==', permaLink)
    .withConverter(LeaderConverter)
    .get()
  if (doc.empty) {
    return undefined
  }
  return doc.docs[0].data()
}

export const mustGetRootLeaderByPermaLink = async (permaLink: string) => {
  const leader = await getRootLeaderByPermaLink(permaLink)
  if (!leader) {
    throw new Error('Leader not found for permaLink: ' + permaLink)
  }
  return leader
}

type GetLeaders = (args: { stateCode: StateCode }) => Promise<Leader[]>
export const getStateLeaders: GetLeaders = async ({ stateCode }) => {
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

export const getRecentlyUpdatedLeaders = async ({
  limit = 10,
}: {
  limit?: number
}) => {
  const collectionRef = db
    .collection('leaders')
    .withConverter(LeaderConverter)
    .orderBy('updatedAt', 'desc')
    .limit(limit)
  const querySnapshot = await collectionRef.withConverter(LeaderConverter).get()
  if (querySnapshot.empty) {
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
    .orderBy('permaLink')
    .get()

  if (leadersSnapshot.empty) {
    throw new Error('No leaders found for state: ' + stateCode)
  }

  // rotate the leaders so that the post's leader3 is last and the rest are in order
  const leaderDocs = leadersSnapshot.docs.map((doc) => doc.data())
  const latestPost = postSnapshot.docs[0].data()
  const leader3 = leaderDocs.find(
    (leader) => leader.permaLink === latestPost.leader3.permaLink,
  )
  if (!leader3) {
    throw new Error(
      'No leader3 found for ' + stateCode + ' post: ' + latestPost.dateID,
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
  return doc.data()
}

export const mustGetRootLeaderById = async (id: string) => {
  const leader = await getRootLeaderById(id)
  if (!leader) {
    throw new Error('No root leader exists with id: ' + id)
  }
  return leader
}

export const getStateLeaderById = async (id: string, stateCode: StateCode) => {
  const doc = await db
    .collection('states')
    .doc(stateCode)
    .collection('leaders')
    .withConverter(LeaderConverter)
    .doc(id)
    .get()
  return doc.data()
}

export const getAnyStateLeaderByPermaLink = async (permaLink: string) => {
  const doc = await db
    .collectionGroup('leaders')
    .where('permaLink', '==', permaLink)
    .withConverter(LeaderConverter)
    .get()
  if (doc.empty) {
    return undefined
  }
  console.log(
    'Found leader refs:',
    doc.docs.map((d) => d.ref.path),
  )
  const stateLeaders = doc.docs.filter((d) => d.ref.path.startsWith('states/'))
  if (stateLeaders.length === 0) {
    return undefined
  }
  return stateLeaders[0].data()
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
  // set does use toFirestore
  await doc.set(data, { merge: true })
}

export const deleteLeaderFromStateCollectionOnly = async ({
  leader,
  state,
}: {
  leader: Leader
  state: State
}) => {
  await db
    .collection('states')
    .doc(state.ref.id)
    .collection('leaders')
    .doc(leader.ref.id)
    .delete()
}

export const deleteLeaderFromRootCollection = async (leader: Leader) => {
  await db.collection('leaders').doc(leader.ref.id).delete()
}

// get all leaders in baches of 250
// update each leader with the normalized data
// return the number of leaders updated
//
// export const normalizeAllLeaders = async () => {
//   const normalizeLeader = (leader: Leader): Leader => {
//     // change something
//     return leader
//   }

//   const batchSize = 250
//   let lastDoc: QueryDocumentSnapshot | undefined = undefined
//   let count = 0

//   while (true) {
//     let query = db
//       .collection('leaders')
//       .withConverter(LeaderConverter)
//       .limit(batchSize)
//     if (lastDoc) {
//       query = query.startAfter(lastDoc)
//     }

//     const snapshot = await query.get()
//     if (snapshot.empty) {
//       break
//     }

//     const batch = db.batch()
//     snapshot.docs.forEach((doc) => {
//       const data = doc.data()
//       const normalizedData = normalizeLeader(data)
//       batch.set(doc.ref, normalizedData)
//       count++
//     })

//     await batch.commit()
//     lastDoc = snapshot.docs[snapshot.docs.length - 1]
//   }

//   return count
// }

/**
 * Batch save leaders to root and state collections
 */
// TODO: should this use `set` instead of `update`?
export const saveLeaderBatch = async ({ leaders }: { leaders: Leader[] }) => {
  const batch = db.batch()
  const now = new Date()

  leaders.forEach((unparsedLeader) => {
    const leader = leaderDbParser.parse(unparsedLeader)
    leader.updatedAt = now

    const rootLeaderRef = db
      .collection('leaders')
      .withConverter(LeaderConverter)
      .doc(unparsedLeader.ref.id)
    batch.update(rootLeaderRef, leader)

    if (!leader.StateCode)
      throw new Error('Leader missing StateCode: ' + unparsedLeader.ref.id)

    const stateLeaderRef = db
      .collection('states')
      .doc(leader.StateCode)
      .collection('leaders')
      .withConverter(LeaderConverter)
      .doc(unparsedLeader.ref.id)
    batch.update(stateLeaderRef, leader)
  })

  return await batch.commit()
}

/**
 * Save a single leader to root and state collections
 */
export const saveLeaderToBothRootAndStateCollections = async ({
  leader,
}: {
  leader: Leader
}) => {
  const dbLeader = leaderDbParser.parse(leader)

  if (!leader.StateCode)
    throw new Error('Leader missing StateCode: ' + leader.ref.id)

  const rootLeaderRef = db
    .collection('leaders')
    .withConverter(LeaderConverter)
    .doc(leader.ref.id)
  await rootLeaderRef.set(dbLeader, { merge: true })

  const stateLeaderRef = db
    .collection('states')
    .doc(leader.StateCode)
    .collection('leaders')
    .withConverter(LeaderConverter)
    .doc(leader.ref.id)
  await stateLeaderRef.set(dbLeader, { merge: true })

  return mustGetRootLeaderById(leader.ref.id)
}

/**
 * Save some fields of a leader to root and possibly state collection
 * if it exists in the state collection. Does not parse the leader, so
 * it will save any fields that are passed in to leaderData.
 *
 * Returns the root leader and the state leader if it exists.
 */
export const mergeUpdateLeader = async ({
  permaLink,
  leaderData,
}: {
  permaLink: string
  leaderData: Partial<Leader>
}) => {
  leaderData.updatedAt = new Date()
  const rootLeaderCollectionRef = db
    .collection('leaders')
    .withConverter(LeaderConverter)
    .where('permaLink', '==', permaLink)
  const rootLeaderSnapshot = await rootLeaderCollectionRef.get()
  if (rootLeaderSnapshot.empty) {
    throw new Error('No root leader found with permaLink: ' + permaLink)
  }

  await rootLeaderSnapshot.docs[0].ref.update(leaderData)
  const rootLeader = rootLeaderSnapshot.docs[0].data()

  const stateLeaderCollectionRef = db
    .collection('states')
    .doc(rootLeader.StateCode)
    .collection('leaders')
    .withConverter(LeaderConverter)
    .where('permaLink', '==', permaLink)
  const stateLeaderSnapshot = await stateLeaderCollectionRef.get()

  if (stateLeaderSnapshot.empty) {
    return { rootLeader, stateLeader: undefined }
  }

  const stateLeaderDocRef = stateLeaderSnapshot.docs[0].ref
  await stateLeaderDocRef.update(leaderData)
  const stateLeader = stateLeaderSnapshot.docs[0].data()

  return { rootLeader, stateLeader }
}
