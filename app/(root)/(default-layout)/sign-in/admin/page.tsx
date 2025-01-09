import { getCurrentUser } from '@/lib/firebase/server/auth'
import { LoginForm } from '../login-form'
import { User } from 'firebase/auth'

export default async function SignInAdminPage() {
  const currentUser = await getCurrentUser()
  const initialUser: User = currentUser?.toJSON() as User

  return <LoginForm initialUser={initialUser} signedInRedirectPath="/admin" />
}
