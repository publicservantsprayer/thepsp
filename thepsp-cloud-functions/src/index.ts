/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import { onRequest } from 'firebase-functions/v2/https'
// import * as logger from 'firebase-functions/logger'

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info('Hello logs!', { structuredData: true })
//   response.send('Hello from Firebase!')
// })

import { initializeApp, applicationDefault } from 'firebase-admin/app'

// import * as functions from 'firebase-functions/v1'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { logger } from 'firebase-functions'
import { getFirestore } from 'firebase-admin/firestore'
import { storage } from 'firebase-admin'
import moment from 'moment-timezone'
import { createPostPhoto } from './createPostPhoto'
import { createDailyPost } from './createDailyPost'
import { Post } from './types'
// import { createFacebookPost } from './facebook/createFacebookPost'
// import rss from './rss'

initializeApp({
  credential: applicationDefault(),
})

/**
 * Development or Production database
 */
// const databaseName = 'psp-dev'
const databaseName = '(default)'

export const db = getFirestore(databaseName)
export const defaultBucket = storage().bucket('repsp123.appspot.com')
export const leadersBucket = storage().bucket('repsp123-leaders')
export const postsBucket = storage().bucket('repsp123-posts')

// const timezone = 'America/New_York'

// export const rssHandler = functions.https.onRequest(rss(db, dateID))

/**
 * Create daily posts for each state
 */
export const createDailyPostHandler = onSchedule(
  {
    schedule: 'every day 04:55',
    timeZone: 'America/New_York', // Sets Eastern Time
  },
  async () => {
    logger.info('Creating daily posts')
    const dateID = moment().tz('America/New_York').format('YYYY-MM-DD')

    const statesSnapshot = await db
      .collection('states')
      .where('createDailyPost', '==', true)
      .get()

    const stateCodes = statesSnapshot.docs.map((doc) => doc.id)

    const posts = stateCodes.map(async (stateCode) => {
      return createDailyPost(db, stateCode, dateID)
    })

    await Promise.all(posts)

    logger.info('Daily posts created')
  },
)

/**
 * Create post photos
 */
export const createPostPhotoHandler = onDocumentCreated(
  {
    document: 'states/{stateCode}/posts/{date}',
    database: databaseName,
  },
  async (event) => {
    const stateCode = event.params.stateCode
    const date = event.params.date
    const snapshot = event.data

    if (!snapshot)
      throw new Error(`No snapshot found for ${stateCode}/posts/${date}`)

    const post = snapshot.data()

    return createPostPhoto(date, stateCode, post as Post)
  },
)
