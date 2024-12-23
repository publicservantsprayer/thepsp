'use client'

import React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import AppBar from '@mui/material/AppBar'
import { useDesktop } from '@/hooks/use-desktop'
import { DesktopContainer } from '@/components/desktop-container'
import { TabPanel } from './tab-panel'
import { Leader } from '@/lib/leader'

interface Props {
  leaders: Leader[]
}

export function StateLeaders({ leaders }: Props) {
  const [currentTab, setCurrentTab] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, tabIndex: number) =>
    setCurrentTab(tabIndex)

  const desktop = useDesktop()
  const tabsVariant = desktop ? 'standard' : 'fullWidth'

  return (
    <>
      <div
        id="state-legislators"
        style={{ position: 'relative', top: '-90px' }}
      />
      <AppBar position="static" enableColorOnDark>
        <Tabs
          value={currentTab}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="secondary"
          variant={tabsVariant}
          centered
        >
          <Tab label="House" />
          <Tab label="Senate" />
        </Tabs>
      </AppBar>

      <DesktopContainer maxWidth="md">
        <div className="mt-1 mb-12">
          <TabPanel
            leaders={leaders}
            chamber="H"
            currentTab={currentTab}
            index={0}
          />
          <TabPanel
            leaders={leaders}
            chamber="S"
            currentTab={currentTab}
            index={1}
          />
        </div>
      </DesktopContainer>
    </>
  )
}
