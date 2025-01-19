import * as React from 'react'

import Link, { LinkProps } from 'next/link'
import { cn } from '@/lib/utils'
import { NavigationMenuLink } from '@/components/ui/navigation-menu'

interface Props extends LinkProps {
  className?: string
  title: string
  children: React.ReactNode
  ref?: React.Ref<HTMLAnchorElement>
}

export function NavMenuItem({
  className,
  title,
  children,
  ref,
  ...props
}: Props) {
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
