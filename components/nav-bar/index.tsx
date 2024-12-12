'use client'

import React, { useState } from 'react'
import Toolbar from '@mui/material/Toolbar'
import Paper from '@mui/material/Paper'

import AppBar from './app-bar'
import DrawerMenu from './drawer-menu'

export function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const stateCode = 'tx'

  return (
    <div sx={{ boxShadow: 12 }}>
      <AppBar setDrawerOpen={setDrawerOpen} />
      <Toolbar />

      <DrawerMenu
        setDrawerOpen={setDrawerOpen}
        drawerOpen={drawerOpen}
        stateCode={stateCode}
      />

      <div
        sx={{
          background: {
            sm: 'url("/images/capitol-color-night.jpg") top left no-repeat',
            xs: 'url("/images/capitol-color-night-700.jpg") top left no-repeat',
          },
          backgroundPositionY: { sm: '-400px', xs: '-150px' },
          backgroundAttachment: 'fixed',
          overflow: 'hidden',
          height: { sm: 'auto', xs: '180px' },
        }}
      >
        <div sx={{ mx: 3, mt: 3, mb: 8 }}>
          <Paper
            sx={{
              background: 'rgba(0, 0, 0, 0.6)',
              width: { sm: '38%', xs: '100%' },
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
            square
          >
            <img
              sx={{ width: '100%' }}
              src="/images/public-servants-prayer.png"
              alt="public servants' prayer"
            />
          </Paper>
        </div>

        {/* <NavBarDailyLeaders /> */}
      </div>
    </div>
  )
}
