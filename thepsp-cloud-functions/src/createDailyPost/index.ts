import moment from 'moment'
import {
  Firestore,
  CollectionReference,
  WithFieldValue,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from '@google-cloud/firestore'
import { Leader, Post } from '../types'

const LeaderConverter: FirestoreDataConverter<Leader> = {
  fromFirestore: (snapshot: QueryDocumentSnapshot<Leader>): Leader => {
    return snapshot.data()
  },
  toFirestore: (data: WithFieldValue<Leader>) => {
    return data
  },
}

const previousDayID = (dateID: string): string =>
  moment(dateID).subtract(1, 'day').format('YYYY-MM-DD')

const createPost = async (
  dateID: string,
  docs: FirebaseFirestore.QueryDocumentSnapshot<Leader>[],
  postsRef: CollectionReference,
) => {
  return postsRef.doc(dateID).set({
    dateID: dateID,
    leader1: docs[0].data(),
    leader2: docs[1].data(),
    leader3: docs[2].data(),
  })
}

export const createDailyPost = async (
  db: Firestore,
  stateCode: string,
  dateID: string,
) => {
  const leadersRef = db
    .collection('states')
    .doc(stateCode)
    .collection('leaders')
    .withConverter(LeaderConverter)
    .where('hasPhoto', '==', true)
    .orderBy('permaLink')

  const postsRef = db.collection('states').doc(stateCode).collection('posts')

  const previousPost = await postsRef.doc(previousDayID(dateID)).get()

  const firstThree = await leadersRef.limit(3).get()
  let docs = firstThree.docs

  if (previousPost.exists) {
    const lastLeader = previousPost.data() as Post
    const leader3 = lastLeader.leader3

    // look up startAfter docs
    const nextThree = await leadersRef
      .startAfter(leader3.permaLink)
      .limit(3)
      .get()
    // Add on the first three in case we need to wrap
    docs = nextThree.docs.concat(docs)
  }

  return createPost(dateID, docs, postsRef)
}
