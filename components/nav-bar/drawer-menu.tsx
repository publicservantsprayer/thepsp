'use client'

import React from 'react'
import Toolbar from '@mui/material/Toolbar'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
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
import Link from 'next/link'

// import { useUser, useAdmin } from '../utilities/firebase'
import MobileOnly from '../mobile-only'
// import useHomePath from '../utilities/useHomePath'

interface ListItemProps {
  Icon: React.ElementType
  text: string
  to: string
}

const ListItem = ({ Icon, text, to }: ListItemProps) => {
  // const location = useLocation()
  const selected = to === location.pathname

  return (
    <ListItemButton LinkComponent={Link} href={to} selected={selected}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  )
}
interface Props {
  drawerOpen: boolean
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
  stateCode: string
}

export default function DrawerMenu({
  drawerOpen,
  setDrawerOpen,
  stateCode,
}: Props) {
  // const [user] = useUser()
  // const [admin] = useAdmin()
  // const homePath = useHomePath()
  const user: { email: string } = { email: 'test@test.com' }
  const admin = null
  const homePath = '/'
  stateCode = 'tx'

  if (!stateCode) return null

  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  return (
    <Drawer
      open={drawerOpen}
      anchor="right"
      onClose={handleDrawerClose}
      onClick={handleDrawerClose}
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

        {user && <div sx={{ margin: 2 }}>{user.email}</div>}
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
