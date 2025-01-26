import {
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore'
import { db } from '@/lib/firebase/server/admin-app'
import { Post, PostDb, StateCode } from '@/lib/types'
import { postSchemaParser } from './posts.schema'

export const PostConverter: FirestoreDataConverter<Post> = {
  fromFirestore: (snapshot: QueryDocumentSnapshot<PostDb>) => {
    const data = snapshot.data()
    return {
      ...data,
      leader1: JSON.parse(JSON.stringify(data.leader1)),
      leader2: JSON.parse(JSON.stringify(data.leader2)),
      leader3: JSON.parse(JSON.stringify(data.leader3)),
      ref: {
        id: snapshot.id,
        // The source of truth is always the root leader
        // so we use the manually use the root path, even if we got this
        // leader from a state subcollection
        path: `leaders/${snapshot.id}`,
      },
    }
  },
  toFirestore: (doc) => {
    return postSchemaParser.parse(doc)
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
  dateID: string,
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
