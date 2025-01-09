import {
  type User,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { initializeApp, getApps } from 'firebase/app'
import { firebaseConfig } from '@/lib/firebase/config'

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

const firebaseAuth = getAuth(app)

export function onAuthStateChanged(callback: (authUser: User | null) => void) {
  return firebaseOnAuthStateChanged(firebaseAuth, callback)
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()

  try {
    const result = await signInWithPopup(firebaseAuth, provider)
    const idToken = await result.user.getIdToken()

    const { ok, success } = await _postIdToken(idToken, '/api/auth/sign-in')
    return ok && success
  } catch (error) {
    console.error('Error signing in with Google', error)
  }
}

export const createUserWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  try {
    const userCredential = await firebaseCreateUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    )
    const user = userCredential.user

    const idToken = await user.getIdToken()

    const { ok, success } = await _postIdToken(idToken, '/api/auth/sign-in')

    if (ok && success) {
      return user
    } else {
      console.error('user: ', JSON.stringify(user))
      return false
    }
  } catch (error) {
    console.error(error)
  }
}

export const signInWithEmailAndPassword = async (
  email: string,
  password: string,
) => {
  console.log({ email, password })
  try {
    const userCredential = await firebaseSignInWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    )
    const user = userCredential.user

    console.log({ user })

    const idToken = await user.getIdToken()

    console.log({ idToken })

    const { ok, success } = await _postIdToken(idToken, '/api/auth/sign-in')

    if (ok && success) {
      return user
    } else {
      console.error('user: ', JSON.stringify(user))
      return false
    }
  } catch (error) {
    console.error(error)
  }
}

export const signOut = async () => {
  try {
    await firebaseAuth.signOut()

    const response = await fetch('/api/auth/sign-out', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const resBody = (await response.json()) as unknown as APIResponse<string>

    if (response.ok && resBody.success) {
      return true
    } else return false
  } catch (error) {
    console.error('Error signing out', error)
    return false
  }
}

export const updateUserData = async ({
  displayName,
}: {
  displayName: string
}) => {
  if (!firebaseAuth.currentUser) {
    throw new Error('User not authenticated')
  }

  try {
    await updateProfile(firebaseAuth.currentUser, {
      displayName,
      // photoURL: 'https://example.com/jane-q-user/profile.jpg',
    })
  } catch (error) {
    console.error('Error updating profile', error)
    return { success: false }
  }

  return { success: true }
}

async function _postIdToken(idToken: string, endpoint: string) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
  })
  const resBody = (await response.json()) as unknown as APIResponse<string>

  return { ok: response.ok, success: resBody.success }
}
