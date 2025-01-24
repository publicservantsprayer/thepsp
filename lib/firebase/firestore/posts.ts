import {
  QueryDocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore'
import { db } from '@/lib/firebase/server/admin-app'
import { Post, PostDbType, StateCode } from '@/lib/types'

export const PostConverter: FirestoreDataConverter<Post> = {
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
  toFirestore: (doc) => {
    delete doc.id
    // delete doc.dto
    return doc
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
