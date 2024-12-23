'use client'

import React from 'react'
import AppBar from '@mui/material/AppBar'
import { DesktopContainer } from '@/components/desktop-container'
import { TabPanel } from './tab-panel'
import { Leader } from '@/lib/leader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  leaders: Leader[]
}

export function StateLeaders({ leaders }: Props) {
  return (
    <>
      <div id="state-legislators" className="relative top-[-90px]" />
      <Tabs>
        <AppBar position="static" enableColorOnDark>
          <TabsList>
            <TabsTrigger value="house">House</TabsTrigger>
            <TabsTrigger value="senate">Senate</TabsTrigger>
          </TabsList>
        </AppBar>

        <DesktopContainer maxWidth="md">
          <div className="mt-1 mb-12">
            <TabsContent value="house">
              <TabPanel leaders={leaders} chamber="H" />
            </TabsContent>
            <TabsContent value="senate">
              <TabPanel leaders={leaders} chamber="S" />
            </TabsContent>
          </div>
        </DesktopContainer>
      </Tabs>
    </>
  )
}
