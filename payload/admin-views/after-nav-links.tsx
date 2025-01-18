import Link from 'next/link'
import React from 'react'

export const AfterNavLinks: React.FC = () => {
  return (
    <>
      <Link href="/">PSP Home</Link>
      <Link href="/psp-admin/leaders">PSPAdmin: Leaders</Link>
    </>
  )
}
