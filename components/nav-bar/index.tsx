'use client'

import React, { useState } from 'react'
import makeStyles from '@mui/styles/makeStyles'
import Toolbar from '@mui/material/Toolbar'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

import AppBar from './app-bar'
// import DrawerMenu from './drawer-menu'
// import DailyLeaders from '../DailyLeaders'
// import { useDesktop } from '@/hooks/use-desktop'
// import useHomePath from '../utilities/useHomePath'
// import useUSAState from '../utilities/useUSAState'

const useStyles = makeStyles((theme) => ({
  header: {
    [theme.breakpoints.up('sm')]: {
      background: 'url("/images/capitol-color-night.jpg") top left no-repeat',
      backgroundPositionY: '-400px',
      //height: '220px',
    },
    [theme.breakpoints.down('sm')]: {
      background:
        'url("/images/capitol-color-night-700.jpg") top left no-repeat',
      backgroundPositionY: '-150px',
      height: '180px',
    },
    backgroundAttachment: 'fixed',
    overflow: 'hidden',
  },
  logoPaper: {
    background: 'rgba(0, 0, 0, 0.6)',
    [theme.breakpoints.up('sm')]: {
      width: '38%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  logo: {
    width: '100%',
  },
}))

// const NavBarDailyLeaders = () => {
//   const desktop = useDesktop()
//   const homePath = useHomePath()
//   const location = useLocation()
//   const { year, month, day } = useParams()
//   const todaysHome = homePath === location.pathname
//   const historicalHome = year && month && day
//   const home = todaysHome || historicalHome

//   if (desktop && home)
//     return (
//       <Box display="flex" justifyContent="center" m={1} w={1}>
//         <DailyLeaders />
//       </Box>
//     )

//   return null
// }

export function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const classes = useStyles()

  return (
    <Box boxShadow={12}>
      <AppBar toggleDrawer={() => setDrawerOpen(!drawerOpen)} />
      <Toolbar />

      {/* <DrawerMenu
        toggleDrawer={toggleDrawer}
        drawerOpen={drawerOpen}
        stateCode={stateCode}
      /> */}

      <Box className={classes.header}>
        <Box mx={3} mt={3} mb={8}>
          <Paper className={classes.logoPaper} square>
            <img
              className={classes.logo}
              src="/images/public-servants-prayer.png"
              alt="public servants' prayer"
            />
          </Paper>
        </Box>

        {/* <NavBarDailyLeaders /> */}
      </Box>
    </Box>
  )
}
