import React from 'react'

import { NavBar as SiteNavBar } from '@/components/nav-bar'
import Footer from '@/components/footer'
import Link from 'next/link'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { getStates } from '@/lib/firebase/firestore'
import { ScrollArea } from '@/components/ui/scroll-area'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { leaderAlgoliaIndex } from '@/lib/firebase/env'

interface Props {
  children: React.ReactNode
}

export default async function DefaultLayout({ children }: Props) {
  await mustGetCurrentAdmin()

  return (
    <>
      <SiteNavBar />
      <PspAdminNavBar />
      <div className="mb-16 flex flex-col items-center gap-4 pt-8 font-lato">
        {children}
      </div>
      <Footer />
    </>
  )
}

async function PspAdminNavBar() {
  const states = await getStates()

  const usingDevDatabase = !!process.env.FIREBASE_DEV_DATABASE_ID

  return (
    <div className="container">
      <div className="mx-auto flex flex-row items-center justify-between">
        <Menubar className="my-2 w-full">
          <MenubarMenu>
            <MenubarTrigger>Leaders</MenubarTrigger>
            <MenubarContent>
              <Link href="/psp-admin/leaders-without-photos">
                <MenubarItem className="cursor-pointer">
                  Leaders Without Photos
                </MenubarItem>
              </Link>
              <Link href="/psp-admin/leader-photo-search">
                <MenubarItem className="cursor-pointer">
                  Leader Photo Search
                </MenubarItem>
              </Link>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>States</MenubarTrigger>
            <MenubarContent>
              <Link href="/psp-admin/states">
                <MenubarItem className="cursor-pointer">All States</MenubarItem>
              </Link>
              <MenubarSeparator />
              <ScrollArea className="h-[75vh]">
                {states.map((state) => (
                  <Link
                    key={state.ref.id}
                    href={`/psp-admin/states/${state.ref.id.toLowerCase()}/legislative`}
                  >
                    <MenubarItem className="cursor-pointer">
                      {state.name}
                    </MenubarItem>
                  </Link>
                ))}
              </ScrollArea>
            </MenubarContent>
          </MenubarMenu>
          {!usingDevDatabase && (
            <div className="text-xs italic text-background">
              Using Production Database w/ {leaderAlgoliaIndex} index
            </div>
          )}
          {usingDevDatabase && (
            <div className="text-xs italic text-destructive">
              Using Dev Database w/ {leaderAlgoliaIndex} index
            </div>
          )}
        </Menubar>
      </div>
    </div>
  )
}
