'use client'

import * as React from 'react'

import Link from 'next/link'
import { User } from 'firebase/auth'

import { signOut } from '@/lib/firebase/auth'
import { CircleUser } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemLink,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUserSession } from './use-user-session'

export function UserMenu({ initialUser }: { initialUser: User }) {
  const user = useUserSession(initialUser)

  console.log('user', user)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <CircleUser />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <LoggedOutUserMenu user={user} />
        <DropdownMenuSeparator />
        <LoggedInUserMenu user={user} />
        <AdminUserMenu user={user} />
        <DropdownMenuSeparator />
        <SignOutMenuItem user={user} />
      </DropdownMenuContent>
    </DropdownMenu>
  )

  function LoggedOutUserMenu({ user }: { user: User | null }) {
    if (user) return null

    return (
      <DropdownMenuItemLink asChild>
        <Link href="/sign-in">Sign In</Link>
      </DropdownMenuItemLink>
    )
  }
}

function LoggedInUserMenu({ user }: { user: User | null }) {
  if (!user) return null

  return (
    <DropdownMenuItemLink asChild>
      <Link href="/profile">Profile</Link>
    </DropdownMenuItemLink>
  )
}

function AdminUserMenu({ user }: { user: User | null }) {
  if (!user) return null

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuItemLink>
        <Link href="/admin">Content</Link>
      </DropdownMenuItemLink>
      <DropdownMenuItemLink asChild>
        <Link href="/x-accounts">X Accounts</Link>
      </DropdownMenuItemLink>
      <DropdownMenuItemLink asChild>
        <Link href="/">Data Import</Link>
      </DropdownMenuItemLink>
    </>
  )
}

function SignOutMenuItem({ user }: { user: User | null }) {
  if (!user) return null

  const handleSignOut: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    signOut()
  }

  return (
    <DropdownMenuItemLink onClick={handleSignOut}>
      Sign Out
    </DropdownMenuItemLink>
  )
}
