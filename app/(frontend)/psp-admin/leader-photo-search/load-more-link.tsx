'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import * as React from 'react'

export function LoadMoreLink() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = searchParams?.get('query')
  let page = searchParams?.get('page')
  page = page ? page : '1'

  if (Number(page) > 9 || !searchParams || !query) {
    return null
  }

  const urlSearchParams = new URLSearchParams(searchParams)
  urlSearchParams.set('page', String(Number(page) + 1))
  const url = `${pathname}?${urlSearchParams.toString()}`

  return (
    <Link href={url} scroll={false} prefetch={false} replace>
      <Button variant="secondary">Load More</Button>
    </Link>
  )
}
