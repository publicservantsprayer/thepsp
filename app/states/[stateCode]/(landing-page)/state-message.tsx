import React from 'react'
import { Typography, Divider } from '@mui/material'
import Link from '@mui/material/Link'
// import Button from '@mui/material/Button'

const P = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-1 my-2">
    <Typography variant="body1" gutterBottom>
      {children}
    </Typography>
  </div>
)

export function StateMessage() {
  const stateName = 'GETSTATENAME'

  return (
    <>
      {/* <MobileOnly>
        <div className="m-1 mt-7 flex justify-center">
          <Typography variant="h4" component="h2" gutterBottom>
            PSP {stateName}
          </Typography>
        </div>
      </MobileOnly> */}
      <div className="m-1 mt-8 mb-1 flex justify-start">
        <Typography variant="h5" component="h2" color="inherit" gutterBottom>
          PSP {stateName}
        </Typography>
      </div>

      <div className="mx-1 my-1">
        <Divider />
      </div>
      <P>
        Every day we pray for three {stateName}{' '}
        <Link href={`/states/${stateName.toLowerCase()}/leaders`}>
          legislators
        </Link>{' '}
        on both the state and federal level.
      </P>

      <P>To help facilitate this movement, we send a post out each morning.</P>

      {/* <Button onClick={() => setTabIndex(1)}>mailing list</Button>
      <Button onClick={() => setTabIndex(2)}>Facebook</Button> */}

      <P>
        If {stateName} is not your state, first{' '}
        <Link href="/find-your-state">find your state</Link> and then follow on
        Facebook, or get on the mailing list.
      </P>

      <P>
        You can join thousands in every state who are praying for their specific
        state leaders each day.
      </P>
    </>
  )
}
