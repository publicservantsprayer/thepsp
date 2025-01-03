import { getAuthenticatedAppForUser } from '@/lib/firebase/server-app'
import { LoginForm } from './login-form'
import { User } from 'firebase/auth'

export default async function SignInPage() {
  const { currentUser } = await getAuthenticatedAppForUser()
  const initialUser: User = currentUser?.toJSON() as User

  return (
    <div className="flex w-full items-center justify-center p-6 outline md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm initialUser={initialUser} />
      </div>
    </div>
  )
}
