import { getServerCookie } from '@/server-functions/get-server-cookie'
import { ExpandableContainerClient } from './expandable-container.client'

interface Props {
  title: string
  children: React.ReactNode
  buttons?: React.ReactNode
}

// Async wrapper component to get the initial cookie value
export async function ExpandableContainer(props: Props) {
  const initialCookieValue = await getServerCookie('expandable-container-open')

  return (
    <ExpandableContainerClient
      {...props}
      initialCookieValue={initialCookieValue}
    />
  )
}
