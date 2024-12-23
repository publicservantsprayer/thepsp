import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export const firebaseApp =
  getApps().length === 0
    ? initializeApp({ credential: applicationDefault() })
    : getApps()[0]

export const db = getFirestore()
