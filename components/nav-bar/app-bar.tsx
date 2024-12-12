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

import MobileOnly from '@/components/mobile-only'
import DesktopOnly from '@/components/desktop-only'
// // import useUSAState from '../utilities/useUSAState'
import Link from 'next/link'

interface AppBarProps {
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function AppBar({ setDrawerOpen }: AppBarProps) {
  // const { stateName } = useUSAState()
  const stateName = 'tx'

  return (
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

        <MobileOnly>
          <IconButton
            onClick={() => setDrawerOpen((prev: boolean) => !prev)}
            edge="start"
            color="inherit"
            size="large"
          >
            <MenuIcon />
          </IconButton>
        </MobileOnly>

        <DesktopOnly>
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
        </DesktopOnly>
      </Toolbar>
    </MuiAppBar>
  )
}

interface ItemProps {
  text: string
  to: string
  Icon: React.ElementType
}

const Item = ({ text, to, Icon }: ItemProps) => {
  return (
    <Button
      color="inherit"
      LinkComponent={Link}
      href={to}
      startIcon={<Icon />}
      sx={{ margin: 1 }}
    >
      {text}
    </Button>
  )
}
