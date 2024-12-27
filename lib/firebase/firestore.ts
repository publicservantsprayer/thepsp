import {
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore'
import { db } from '@/lib/firebase/firebase-admin'

import type {
  StateCode,
  Leader,
  LeaderDbType,
  Post,
  PostDbType,
} from '@/lib/types'

type GetLeaders = (args: { stateCode: StateCode }) => Promise<Leader[]>

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

export const getLeaders: GetLeaders = async ({ stateCode }) => {
  const collectionRef = db
    .collection('states')
    .doc(stateCode)
    .collection('leaders')
  const querySnapshot = await collectionRef.withConverter(LeaderConverter).get()
  if (querySnapshot.empty) {
    console.log('No matching leaders.')
    return []
  }

  return querySnapshot.docs.map((doc) => doc.data())
}

export const getLeader = async (id: string) => {
  const doc = await db
    .collectionGroup('leaders')
    .where('permaLink', '==', id)
    .get()
  return doc.docs[0].data() as Leader
}

const PostConverter: FirestoreDataConverter<Post> = {
  fromFirestore: (snapshot: QueryDocumentSnapshot<PostDbType>) => {
    const data = snapshot.data()
    return {
      ...data,
      leader1: JSON.parse(JSON.stringify(data.leader1)),
      leader2: JSON.parse(JSON.stringify(data.leader2)),
      leader3: JSON.parse(JSON.stringify(data.leader3)),
      id: snapshot.id,
    }
  },
  toFirestore: (post) => {
    delete post.id
    return post
  },
}

export const getLatestPost = async (stateCode: StateCode) => {
  const collectionRef = db
    .collection(`/states/${stateCode}/posts/`)
    .orderBy('dateID', 'desc')
    .limit(1)
    .withConverter(PostConverter)

  const querySnapshot = await collectionRef.get()

  if (querySnapshot.empty) {
    throw new Error('No today post.')
  }

  return querySnapshot.docs.map((doc) => doc.data())[0]
}

export const getHistoricalPost = async (
  stateCode: StateCode,
  dateID: string
) => {
  const collectionRef = db
    .doc(`/states/${stateCode}/posts/${dateID}`)
    .withConverter(PostConverter)

  const documentSnapshot = await collectionRef.get()
  const post = documentSnapshot.data()

  if (!post) {
    throw new Error('No historical post.')
  }

  return post
}
