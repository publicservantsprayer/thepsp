'use client'

import * as React from 'react'

import Link from 'next/link'
import type { CurrentUser } from '@/lib/firebase/server/auth'

import { signOut } from '@/lib/firebase/client/auth'
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
import { useRouter } from 'next/navigation'

export function UserMenu({ initialUser }: { initialUser: CurrentUser | null }) {
  const user = useUserSession(initialUser)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mr-1">
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

  function LoggedOutUserMenu({ user }: { user: CurrentUser | null }) {
    if (user) return null

    return (
      <DropdownMenuItemLink asChild>
        <Link href="/sign-in">Sign In</Link>
      </DropdownMenuItemLink>
    )
  }
}

function LoggedInUserMenu({ user }: { user: CurrentUser | null }) {
  if (!user) return null

  return (
    <Link href="/profile">
      <DropdownMenuItemLink>Profile</DropdownMenuItemLink>
    </Link>
  )
}

function AdminUserMenu({ user }: { user: CurrentUser | null }) {
  if (!user || !user.isAdmin) return null

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

function SignOutMenuItem({ user }: { user: CurrentUser | null }) {
  const router = useRouter()
  if (!user) return null

  const handleSignOut = async () => {
    if (await signOut()) {
      router.push('/sign-in')
    }
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
