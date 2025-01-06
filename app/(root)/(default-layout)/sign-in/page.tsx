import { getAuthenticatedAppForUser } from '@/lib/firebase/server-app'
import { LoginForm } from './login-form'
import { User } from 'firebase/auth'

export default async function SignInPage() {
  const { currentUser } = await getAuthenticatedAppForUser()
  const initialUser: User = currentUser?.toJSON() as User

  return <LoginForm initialUser={initialUser} />
}
