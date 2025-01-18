import { getCurrentUser } from '@/lib/firebase/server/auth'
import { LoginForm } from '../login-form'

export default async function SignInAdminPage() {
  const initialUser = await getCurrentUser()

  return <LoginForm initialUser={initialUser} signedInRedirectPath="/admin" />
}
