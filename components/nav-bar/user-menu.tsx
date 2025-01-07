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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <CircleUser />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          Account
          {user && (
            <div className="mt-1 text-xs text-muted-foreground">
              {user.email}
            </div>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <LoggedOutUserMenu user={user} />
        <LoggedInUserMenu user={user} />
        <AdminUserMenu user={user} />
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
    <Link href="/profile">
      <DropdownMenuItemLink>Profile</DropdownMenuItemLink>
    </Link>
  )
}

function AdminUserMenu({ user }: { user: User | null }) {
  if (!user) return null

  return (
    <>
      <DropdownMenuSeparator />

      <Link href="/admin">
        <DropdownMenuItemLink>Content</DropdownMenuItemLink>
      </Link>
      <Link href="#">
        <DropdownMenuItemLink disabled={true}>X Accounts</DropdownMenuItemLink>
      </Link>
      <Link href="#">
        <DropdownMenuItemLink disabled={true}>Data Import</DropdownMenuItemLink>
      </Link>
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
    <>
      <DropdownMenuSeparator />
      <DropdownMenuItemLink onClick={handleSignOut}>
        Sign Out
      </DropdownMenuItemLink>
    </>
  )
}
