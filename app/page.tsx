import { makeValidStateCode } from '@/data/make-valid-state-code'
import { RedirectToState } from './redirect-to-state'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  const cookieStore = await cookies()
  const cookieStateCodeRequest = cookieStore.get('stateCode')

  if (cookieStateCodeRequest) {
    const stateCode = makeValidStateCode(cookieStateCodeRequest.value)
    return redirect(`/states/${stateCode.toLowerCase()}`)
  }

  return <RedirectToState />
}
