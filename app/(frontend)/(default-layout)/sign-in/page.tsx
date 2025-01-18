import { LoginForm } from './login-form'
import { getCurrentUser } from '@/lib/firebase/server/auth'

export default async function SignInPage() {
  const initialUser = await getCurrentUser()

  return <LoginForm initialUser={initialUser} />
}
