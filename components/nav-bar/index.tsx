import * as React from 'react'

import Link, { LinkProps } from 'next/link'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuNextLink,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Menu } from 'lucide-react'
import { StateName } from '@/components/state-name'
import { UserMenu } from './user-menu'
import { getAuthenticatedAppForUser } from '@/lib/firebase/server-app'
import { User } from 'firebase/auth'
import { validateStateCode } from '@/lib/get-state-info'
import { cookies } from 'next/headers'

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
]

export async function NavBar() {
  const { currentUser } = await getAuthenticatedAppForUser()
  const initialUser: User = currentUser?.toJSON() as User
  const cookieStore = await cookies()
  const cookieStateCode = cookieStore.get('stateCode')?.value
  const verifiedStateCode = validateStateCode(cookieStateCode)

  return (
    <nav className="sticky top-0 z-50 bg-background shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Logo or brand name */}
        <Link href="/" className="hidden font-psp text-xl md:flex">
          PSP <StateName />
        </Link>
        {/* Hamburger menu on small screens */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" className="font-psp text-xl">
              <Menu />
              PSP <StateName stateCode={verifiedStateCode} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4">
            <SheetHeader>
              <SheetTitle className="text-lg font-medium">Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-2">
              <Link href="/">
                <span className="block hover:underline">Home</span>
              </Link>
              <Link href="/about">
                <span className="block hover:underline">About</span>
              </Link>
              <Link href="/contact">
                <span className="block hover:underline">Contact</span>
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        {/* Navigation - hidden below md breakpoint */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuNextLink href="/">Home</NavigationMenuNextLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <Link
                      legacyBehavior
                      passHref
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <NavigationMenuLink>
                        {/* <Icons.logo className="h-6 w-6" /> */}
                        <div className="mb-2 mt-4 font-psp text-2xl">
                          PSP <StateName />
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Praying for our leaders. Recognizing their humanity
                          and challenges. This strengthens our nation by seeking
                          God&rsquo;s guidance and support for them.
                        </p>
                      </NavigationMenuLink>
                    </Link>
                  </li>
                  <ListItem href="/find-your-state" title="Find Your State">
                    If <StateName /> is not your state, use this map to find
                    yours.
                  </ListItem>
                  <ListItem href="/what-we-do" title="What We Do">
                    Every day we pray for three leaders in our state.
                  </ListItem>
                  <ListItem href="/why-we-pray" title="Why We Pray">
                    A fresh approach to political involvement.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Learn More</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <UserMenu initialUser={initialUser} />
      </div>
    </nav>
  )
}

interface ListItemProps extends LinkProps {
  className?: string
  title: string
  children: React.ReactNode
  ref?: React.Ref<HTMLAnchorElement>
}

function ListItem({
  className,
  title,
  children,
  ref,
  ...props
}: ListItemProps) {
  return (
    <li>
      <Link ref={ref} {...props} legacyBehavior passHref>
        <NavigationMenuLink
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </NavigationMenuLink>
      </Link>
    </li>
  )
}
