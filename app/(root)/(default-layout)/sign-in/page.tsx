import { LoginForm } from './login-form'
import { User } from 'firebase/auth'
import { getCurrentUser } from '@/lib/firebase/server/auth'

export default async function SignInPage() {
  const currentUser = await getCurrentUser()
  const initialUser: User = currentUser?.toJSON() as User

  return <LoginForm initialUser={initialUser} />
}
