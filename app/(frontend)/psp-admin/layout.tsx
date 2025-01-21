import React from 'react'

import { NavBar as SiteNavBar } from '@/components/nav-bar'
import Footer from '@/components/footer'
import Link from 'next/link'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar'

interface Props {
  children: React.ReactNode
}

export default function DefaultLayout({ children }: Props) {
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

function PspAdminNavBar() {
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
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  )
}
