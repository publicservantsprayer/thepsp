import React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material-pigment-css/Box'

import { useDesktop } from '@/hooks/use-desktop'
import { DesktopContainer } from '@/components/desktop-container'
import { TabPanel } from '@/components/tab-panel'

export function StateLeaders() {
  const [currentTab, setCurrentTab] = React.useState(0)

  const handleChange = (event, tabIndex) => setCurrentTab(tabIndex)

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
        <Box mt={1} mb={12}>
          <TabPanel chamber="H" currentTab={currentTab} index={0} />
          <TabPanel chamber="S" currentTab={currentTab} index={1} />
        </Box>
      </DesktopContainer>
    </>
  )
}
