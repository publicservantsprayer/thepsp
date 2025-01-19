import Link, { LinkProps } from 'next/link'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  // DrawerDescription,
  // DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Menu } from 'lucide-react'
import { StateName } from '../state-name'

export function HamburgerDrawer({
  resources,
  learnMore,
}: {
  resources: ({ title: string } & LinkProps)[]
  learnMore: ({ title: string } & LinkProps)[]
}) {
  return (
    <Drawer>
      <DrawerTrigger className="md:hidden">
        <Menu />
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerHeader>
          <DrawerTitle className="text-center font-psp text-xl font-medium uppercase">
            PSP &middot; <StateName />
          </DrawerTitle>
        </DrawerHeader>
        <div className="mt-6 grid gap-4">
          <DrawerClose asChild>
            <Link href="/" className="text-muted-foreground">
              Home
            </Link>
          </DrawerClose>
          <DrawerClose asChild>
            <Link href="/find-your-state" className="text-muted-foreground">
              Find Your State
            </Link>
          </DrawerClose>
          <h2 className="mt-6">Resources</h2>

          {resources.map((item) => (
            <DrawerClose asChild key={item.title}>
              <Link
                key={item.title}
                href={item.href}
                className="text-muted-foreground"
              >
                {item.title}
              </Link>
            </DrawerClose>
          ))}

          <h2 className="mt-6">Learn More</h2>
          {learnMore.map((item) => (
            <DrawerClose asChild key={item.title}>
              <Link href={item.href} className="text-muted-foreground">
                {item.title}
              </Link>
            </DrawerClose>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
