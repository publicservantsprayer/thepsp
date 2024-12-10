'use client'

import React from 'react'
// import makeStyles from '@mui/styles/makeStyles'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import PeopleIcon from '@mui/icons-material/People'
import MapIcon from '@mui/icons-material/Map'
import FavoriteIcon from '@mui/icons-material/Favorite'
import MoreIcon from '@mui/icons-material/MoreVert'

import MobileOnly from '../mobile-only'
import DesktopOnly from '../desktop-only'
// import useUSAState from '../utilities/useUSAState'

// const useStyles = makeStyles((theme) => ({
//   AppBar: {
//     zIndex: theme.zIndex.drawer + 1000,
//     backgroundColor: theme.palette.background.default,
//   },
//   header: {
//     [theme.breakpoints.up('md')]: {
//       background: 'url("/images/capitol-color-night.jpg") top left no-repeat',
//       backgroundPositionY: '-400px',
//     },
//     [theme.breakpoints.down('md')]: {
//       background:
//         'url("/images/capitol-color-night-700.jpg") top left no-repeat',
//       backgroundPositionY: '-100px',
//     },
//     backgroundAttachment: 'fixed',
//     overflow: 'hidden',
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//   },
//   button: {
//     margin: theme.spacing(1),
//   },
// }))

const Item = ({ text, to, Icon }) => {
  // const classes = useStyles()

  return (
    <Button color="inherit" startIcon={<Icon />} className="">
      {text}
    </Button>
  )
}

export default function AppBar({ toggleDrawer }: { toggleDrawer: () => void }) {
  // const classes = useStyles()
  // const { stateName } = useUSAState()
  const stateName = 'in'

  return (
    <MuiAppBar color="inherit" position="fixed" className="">
      <Toolbar variant="regular">
        <Box flexGrow={1}>
          <Typography variant="h6" color="inherit">
            PSP {stateName}
          </Typography>
        </Box>

        <MobileOnly>
          <IconButton
            onClick={toggleDrawer}
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
          {/* <Item text="About" Icon={} to="/about" /> */}

          <IconButton
            onClick={toggleDrawer}
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
