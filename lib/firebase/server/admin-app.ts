// This prevents type generation.  Consider adding them back
import 'server-only'

import {
  initializeApp,
  getApps,
  App,
  applicationDefault,
} from 'firebase-admin/app'
import {
  getAuth,
  Auth,
  // UserRecord,
  // SessionCookieOptions,
} from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'
import { getURL } from '@/payload/utilities/getURL'

// Check if the app is already initialized
let adminApp: App
if (!getApps().length) {
  adminApp = initializeApp({
    credential: applicationDefault(),
  })
} else {
  adminApp = getApps()[0]
}

// Initialize the Auth service with the app instance
export const auth: Auth = getAuth(adminApp)

// Check if we want to use the development database
const devDatabaseId = process.env.FIREBASE_DEV_DATABASE_ID
const useDev = devDatabaseId && getURL().includes('localhost')

// Initialize the Firestore service
export const db: FirebaseFirestore.Firestore = useDev
  ? getFirestore(devDatabaseId)
  : getFirestore()

export const storage = getStorage(adminApp)

// Uploaded leader photos
// leader.photoUploadOriginal is the path to the original photo
// leader.photoUploadCropped is the path to the cropped photo
export const leaderPhotoUploadBucket = useDev
  ? getStorage().bucket('repsp123-dev-leader-photo-uploads')
  : getStorage().bucket('repsp123-leader-photo-uploads')

// This has leader thumbnails
// leader.photoFile is the path to the thumbnail
export const leaderThumbnailBucket = useDev
  ? getStorage().bucket('repsp123-dev-leaders')
  : getStorage().bucket('repsp123-leaders')
