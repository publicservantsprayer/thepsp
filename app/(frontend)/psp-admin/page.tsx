import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'

export default async function PspAdminPage() {
  await mustGetCurrentAdmin()

  return (
    <>
      <h1>PSP Admin</h1>
    </>
  )
}
