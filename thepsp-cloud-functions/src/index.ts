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

import * as functions from 'firebase-functions/v1'
import * as admin from 'firebase-admin'
import moment from 'moment-timezone'
// import { stateCodes } from './utilities/states'
import { createPostPhoto } from './createPostPhoto'
import { createDailyPost } from './createDailyPost'
import { createFacebookPost } from './facebook/createFacebookPost'
import rss from './rss'

const stateCodes = ['AK']

admin.initializeApp()
const db = admin.firestore()

const timezone = 'America/New_York'
const dateID = moment().tz(timezone).format('YYYY-MM-DD')

export const rssHandler = functions.https.onRequest(rss(db, dateID))

export const createPostPhotoHandler = functions.firestore
  .document('states/{stateCode}/posts/{date}')
  .onCreate((snap, context) => {
    const stateCode = context.params.stateCode
    const date = context.params.date
    const post = snap.data()

    return createPostPhoto(date, stateCode, post)
  })

export const createDailyPostHandler = functions.pubsub
  .schedule('55 4 * * *')
  .timeZone(timezone)
  .onRun(() => {
    const dateID = moment().format('YYYY-MM-DD')
    const posts = stateCodes.map(async (stateCode) => {
      return createDailyPost(db, stateCode, dateID)
    })

    return Promise.all(posts)
  })

export const createFacebookPostHandler = functions.firestore
  .document('states/{stateCode}/posts/{dateID}')
  .onCreate(async (snapshot, context) => {
    const stateCode = context.params.stateCode
    const dateID = context.params.dateID
    const post = snapshot.data()

    return createFacebookPost(db, dateID, stateCode, post)
  })
