'use client'

import * as React from 'react'

// import Link from 'next/link'
import type { CurrentUser } from '@/lib/firebase/server/auth'

// import { signOut } from '@/lib/firebase/client/auth'
import { CircleUser } from 'lucide-react'
import {
  NavigationMenu,
  // NavigationMenuContent,
  NavigationMenuItem,
  // NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuNextLink,
  // NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
// import { useUserSession } from './use-user-session'
// import { useRouter } from 'next/navigation'
// import { NavMenuItem } from './nav-menu-item'

export function UserMenu({ initialUser }: { initialUser: CurrentUser | null }) {
  // const user = useUserSession(initialUser)

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuNextLink href="/sign-in">
            <CircleUser />
          </NavigationMenuNextLink>
          {/* <NavigationMenuTrigger className="mr-1" hideArrow>
            <CircleUser />
          </NavigationMenuTrigger> */}
          {/* <NavigationMenuContent className="outline">
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              Account
              {user && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {user.email}
                </div>
              )}

              <LoggedOutUserMenu user={user} />
              <LoggedInUserMenu user={user} />
              <AdminUserMenu user={user} />
              <SignOutMenuItem user={user} />
            </ul>
          </NavigationMenuContent> */}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )

  //   function LoggedOutUserMenu({ user }: { user: CurrentUser | null }) {
  //     if (user) return null

  //     return (
  //       <NavMenuItem href="/sign-in" title="Sign In" className="">
  //         Log in to subscribe to get updates in your email.
  //       </NavMenuItem>
  //     )
  //   }
  // }

  // function LoggedInUserMenu({ user }: { user: CurrentUser | null }) {
  //   if (!user) return null

  //   return (
  //     <Link href="/profile">
  //       <NavigationMenuLink>Profile</NavigationMenuLink>
  //     </Link>
  //   )
  // }

  // function AdminUserMenu({ user }: { user: CurrentUser | null }) {
  //   if (!user || !user.isAdmin) return null

  //   return (
  //     <>
  //       {/* <DropdownMenuSeparator /> */}

  //       <Link href="/admin">
  //         <NavigationMenuLink>Content</NavigationMenuLink>
  //       </Link>
  //       {/* <Link href="#">
  //         <NavigationMenuLink disabled={true}>X Accounts</NavigationMenuLink>
  //       </Link>
  //       <Link href="#">
  //         <NavigationMenuLink disabled={true}>Data Import</NavigationMenuLink>
  //       </Link> */}
  //     </>
  //   )
  // }

  // function SignOutMenuItem({ user }: { user: CurrentUser | null }) {
  //   const router = useRouter()
  //   if (!user) return null

  //   const handleSignOut = async () => {
  //     if (await signOut()) {
  //       router.push('/sign-in')
  //     }
  //   }

  //   return (
  //     <>
  //       <NavigationMenuLink onClick={handleSignOut}>Sign Out</NavigationMenuLink>
  //     </>
  //   )
}
