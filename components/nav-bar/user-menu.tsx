'use client'

import * as React from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { signOut } from '@/lib/firebase/client/auth'
import { CircleUser } from 'lucide-react'
import { useUserSession } from './use-user-session'
import { useRouter } from 'next/navigation'
import type { CurrentUser } from '@/lib/firebase/server/auth'

import {
  Menubar,
  MenubarContent,
  MenubarLabel,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar'

export function UserMenu({ initialUser }: { initialUser: CurrentUser | null }) {
  const user = useUserSession(initialUser)

  return (
    <Menubar className="border-none">
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer rounded-lg">
          <CircleUser />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarLabel className="flex flex-row items-center gap-4">
            <div>
              Account
              {user && (
                <div className="pb-1 pt-1 text-xs font-normal text-muted-foreground">
                  {user.email}
                </div>
              )}
            </div>
            {user?.photoURL && (
              <div>
                <Image
                  src={user.photoURL}
                  alt="Profile Picture"
                  width={96}
                  height={96}
                  className="h-8 w-8 rounded-full"
                />
              </div>
            )}
          </MenubarLabel>

          <MenubarSeparator />
          <LoggedOutUserMenu user={user} />
          <LoggedInUserMenu user={user} />
          <AdminUserMenu user={user} />
          <SignOutMenuItem user={user} />
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

function LoggedOutUserMenu({ user }: { user: CurrentUser | null }) {
  if (user) return null

  return (
    <Link href="/sign-in">
      <MenubarItem className="cursor-pointer">Sign In</MenubarItem>
    </Link>
  )
}

function LoggedInUserMenu({ user }: { user: CurrentUser | null }) {
  if (!user) return null

  return (
    <>
      <Link href="/profile">
        <MenubarItem className="cursor-pointer">Profile</MenubarItem>
      </Link>
      <MenubarItem disabled={true}>Daily Email Posts</MenubarItem>
    </>
  )
}

function AdminUserMenu({ user }: { user: CurrentUser | null }) {
  if (!user || !user.isAdmin) return null

  return (
    <>
      <Link href="/admin">
        <MenubarItem className="cursor-pointer">Content</MenubarItem>
      </Link>
      <Link href="/psp-admin">
        <MenubarItem className="cursor-pointer">PSP Admin</MenubarItem>
      </Link>
      <Link href="#">
        <MenubarItem disabled={true}>X Accounts</MenubarItem>
      </Link>
      <Link href="#">
        <MenubarItem disabled={true}>Data Import</MenubarItem>
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
      <MenubarItem onClick={handleSignOut} className="cursor-pointer">
        Sign Out
      </MenubarItem>
    </>
  )
}
