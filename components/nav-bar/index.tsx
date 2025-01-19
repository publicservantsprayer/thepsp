import * as React from 'react'

import Link, { LinkProps } from 'next/link'
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
import { StateName } from '@/components/state-name'
import { UserMenu } from './user-menu'
import { getCurrentUser } from '@/lib/firebase/server/auth'
import { Nav } from './nav'
import { HamburgerDrawer } from './hamburger-drawer'

const resources: { title: string; href: string; description: string }[] = [
  {
    title: "Matt's Updates",
    href: '/updates',
    description:
      "Read Matt's personal reflections and updates on our journey towards a more prayerful political climate.",
  },
  {
    title: "Women's Ministry",
    href: '/womens-ministry',
    description:
      "Engage with our Women's Ministry dedicated to empowering female voices in prayer leadership.",
  },
  {
    title: 'Articles',
    href: '/articles',
    description:
      'Explore insightful articles on the impact of prayer in politics and spiritual leadership.',
  },
  {
    title: 'Events',
    href: '/events',
    description:
      "Join us at upcoming events where we gather to pray for our nation's leaders..",
  },
  {
    title: 'Newsletters',
    href: '/newsletters',
    description:
      'Quarterly newsletters with updates on our work and the impact of prayer in politics.',
  },
  {
    title: 'Beyond the Ballot',
    href: '/beyond-the-ballot',
    description:
      'This study calls women to move beyond the ballot to effectively pray for their nation.',
  },
]

const learnMore: { title: string; href: string; description: string }[] = [
  {
    title: 'What We Do',
    href: '/what-we-do',
    description: 'Every day we pray for three leaders in our state..',
  },
  {
    title: 'Why We Pray',
    href: '/why-we-pray',
    description:
      'Discover the driving force behind our commitment to pray for political leaders.',
  },
  {
    title: 'Testimonies',
    href: '/testimonies',
    description:
      'Be inspired by real-life stories of how prayer has touched our leaders and communities.',
  },
  {
    title: 'Statement of Faith',
    href: '/statement-of-faith',
    description: 'Our Statement of Faith outlines our core beliefs.',
  },
  // {
  //   title: 'Prayer Resources',
  //   href: '/prayer-resources',
  //   description:
  //     'Access tools and guides tailored for praying for those in public service.',
  // },
  // {
  //   title: 'Frequently Asked Questions (FAQ)',
  //   href: '/faq',
  //   description: 'Get answers to common questions about our prayer initiative.',
  // },
  // {
  //   title: 'Our History',
  //   href: '/our-history',
  //   description:
  //     "Trace the journey of Public Servants' Prayer from its inception to now.",
  // },
  // {
  //   title: 'Impact Stories',
  //   href: '/impact-stories',
  //   description:
  //     'Read about the tangible effects prayer has had in the political arena.',
  // },
  // {
  //   title: 'Give Support',
  //   href: 'give-support',
  //   description:
  //     'Support our mission financially to expand our reach and deepen our impact.',
  // },
  // {
  //   title: 'Volunteer',
  //   href: '/volunteer',
  //   description:
  //     'Volunteer with us to help spread the message of prayer across the nation.',
  // },
]

export async function NavBar() {
  const currentUser = await getCurrentUser()

  return (
    <Nav className="xxxxshadow-2xl sticky top-0 z-50 border-y border-primary/20 bg-background">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Hamburger menu on small screens */}
        <HamburgerDrawer resources={resources} learnMore={learnMore} />

        {/* Logo or brand name */}
        <Link href="/" className="font-psp uppercase md:flex">
          PSP &middot; <StateName />
        </Link>

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
                        <div className="mb-2 mt-4 text-2xl">
                          <span className="font-psp">PSP</span> <StateName />
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Praying for our leaders. Recognizing their humanity
                          and challenges and strengthening our nation by seeking
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
                  {resources.map((component) => (
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
                  {learnMore.map((component) => (
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

        <UserMenu initialUser={currentUser} />
      </div>
    </Nav>
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
