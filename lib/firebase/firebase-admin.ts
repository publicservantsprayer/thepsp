import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { firebaseConfig } from './config'

export const firebaseApp =
  getApps().length === 0
    ? initializeApp({ credential: applicationDefault(), ...firebaseConfig })
    : getApps()[0]

export const db = getFirestore()
