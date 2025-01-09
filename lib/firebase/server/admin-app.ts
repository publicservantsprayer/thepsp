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
import { firebaseConfig } from '@/lib/firebase/config'
import { getFirestore } from 'firebase-admin/firestore'

// Check if the app is already initialized
let adminApp: App
if (!getApps().length) {
  adminApp = initializeApp({
    credential: applicationDefault(),
    ...firebaseConfig,
  })
} else {
  adminApp = getApps()[0]
}

// Initialize the Auth service with the app instance
export const auth: Auth = getAuth(adminApp)

export const db: FirebaseFirestore.Firestore = getFirestore(adminApp)
