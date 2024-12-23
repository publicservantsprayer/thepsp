'use client'

import React from 'react'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { Typography } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import PeopleIcon from '@mui/icons-material/People'
import MapIcon from '@mui/icons-material/Map'
import FavoriteIcon from '@mui/icons-material/Favorite'
import MoreIcon from '@mui/icons-material/MoreVert'

// // import useUSAState from '../utilities/useUSAState'
import Link from 'next/link'
import { DrawerMenu } from './drawer-menu'
import { User } from 'firebase/auth'
import { ModeSelect } from '../mode-select'

interface Props {
  initialUser: User | null
}

export function AppBar({ initialUser }: Props) {
  // const { stateName } = useUSAState()
  const stateName = 'Texas'
  const stateCode = 'tx'
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  return (
    <>
      <MuiAppBar
        color="inherit"
        position="fixed"
        sx={(theme) => ({
          backgroundColor: 'background.default',
          zIndex: theme.zIndex.drawer + 1,
        })}
      >
        <Toolbar variant="regular">
          <div sx={{ flexGrow: 1 }}>
            <Typography variant="h6" color="inherit">
              PSP {stateName}
            </Typography>
          </div>

          <div sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              onClick={() => setDrawerOpen((prev: boolean) => !prev)}
              edge="start"
              color="inherit"
              size="large"
            >
              <MenuIcon />
            </IconButton>
          </div>

          <div
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 2,
            }}
          >
            <Item text="Home" Icon={HomeIcon} to="/" />
            <Item text="Find Your State" Icon={MapIcon} to="/find-your-state" />
            <Item text="What We Do" Icon={PeopleIcon} to="/what-we-do" />
            <Item text="Why We Pray" Icon={FavoriteIcon} to="/why-we-pray" />
            <Item text="About" Icon={FavoriteIcon} to="/about" />

            <IconButton
              onClick={() => setDrawerOpen((prev: boolean) => !prev)}
              edge="end"
              color="inherit"
              size="large"
            >
              <MoreIcon />
            </IconButton>
            <ModeSelect />
          </div>
        </Toolbar>
      </MuiAppBar>

      <Toolbar />

      <DrawerMenu
        setDrawerOpen={setDrawerOpen}
        drawerOpen={drawerOpen}
        stateCode={stateCode}
        initialUser={initialUser}
      />
    </>
  )
}

interface ItemProps {
  text: string
  to: string
  Icon: React.ElementType
}

function Item({ text, to, Icon }: ItemProps) {
  return (
    <Button color="inherit" LinkComponent={Link} href={to} startIcon={<Icon />}>
      {text}
    </Button>
  )
}
