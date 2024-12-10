'use client'

import React from 'react'
import Box from '@mui/material-pigment-css/Box'
import Toolbar from '@mui/material/Toolbar'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import MuiListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import HomeIcon from '@mui/icons-material/Home'
import PeopleIcon from '@mui/icons-material/People'
import MapIcon from '@mui/icons-material/Map'
import FavoriteIcon from '@mui/icons-material/Favorite'
import DashboardIcon from '@mui/icons-material/Dashboard'
import EventIcon from '@mui/icons-material/Event'
import PostAddIcon from '@mui/icons-material/PostAdd'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import FilterVintageIcon from '@mui/icons-material/FilterVintage'
import NaturePeopleIcon from '@mui/icons-material/NaturePeople'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'

// import { useUser, useAdmin } from '../utilities/firebase'
import MobileOnly from '../mobile-only'
// import useHomePath from '../utilities/useHomePath'

const ListItem = ({ Icon, text, to }) => {
  const location = useLocation()
  const selected = to === location.pathname

  const NullComponent = () => null

  return (
    <MuiListItem button component={NullComponent} to={to} selected={selected}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={text} />
    </MuiListItem>
  )
}

export default function DrawerMenu({ drawerOpen, toggleDrawer, stateCode }) {
  // const [user] = useUser()
  // const [admin] = useAdmin()
  // const homePath = useHomePath()
  const homePath = '/'

  if (!stateCode) return null

  return (
    <Drawer
      open={drawerOpen}
      anchor="right"
      onClose={toggleDrawer(false)}
      onClick={toggleDrawer(false)}
      variant="temporary"
    >
      <Toolbar />
      <List>
        <MobileOnly>
          <ListItem text="Home" Icon={HomeIcon} to={homePath} />
          <ListItem
            text="Find Your State"
            Icon={MapIcon}
            to="/find-your-state"
          />
          <ListItem text="What We Do" Icon={PeopleIcon} to="/what-we-do" />
          <ListItem text="Why We Pray" Icon={FavoriteIcon} to="/why-we-pray" />

          <Divider />
        </MobileOnly>

        <ListItem text="Articles" Icon={DashboardIcon} to="/articles" />
        <ListItem text="Events" Icon={EventIcon} to="/events" />
        <ListItem text="Matt's Updates" Icon={PostAddIcon} to="/updates" />
        <ListItem
          text="Women's Ministry"
          Icon={FilterVintageIcon}
          to="/women"
        />

        <Divider />

        <ListItem
          text="Give/Volunteer"
          Icon={SupervisedUserCircleIcon}
          to="/give"
        />
        <ListItem
          text="Our Partners"
          Icon={NaturePeopleIcon}
          to="/our-partners"
        />

        <Divider />

        {!user && (
          <ListItem text="Sign In" Icon={AccountCircleIcon} to="/sign-in" />
        )}

        {user && <Box m={2}>{user.email}</Box>}
        {user && (
          <ListItem text="Profile" Icon={AccountBoxIcon} to="/profile" />
        )}
        {user && (
          <ListItem text="Sign Out" Icon={ExitToAppIcon} to="/sign-out" />
        )}
        {admin && (
          <>
            <ListItem text="Content" Icon={DashboardIcon} to="/content" />
            {/* <ListItem text="Twitter Accounts" to="/twitter-accounts" /> */}
            <ListItem text="Data Import" Icon={DashboardIcon} to="/data" />
          </>
        )}
      </List>
    </Drawer>
  )
}
