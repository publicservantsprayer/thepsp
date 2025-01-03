import { validateStateCode } from '@/lib/get-state-info'
import { RedirectToState } from './redirect-to-state'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  const cookieStore = await cookies()
  const cookieStateCodeRequest = cookieStore.get('stateCode')

  if (cookieStateCodeRequest) {
    const stateCode = validateStateCode(cookieStateCodeRequest.value)
    if (stateCode) {
      return redirect(`/states/${stateCode.toLowerCase()}`)
    }
  }

  return <RedirectToState />
}
