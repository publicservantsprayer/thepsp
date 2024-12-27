import React from 'react'
import moment from 'moment'
import Paper from '@mui/material/Paper'

// import Accordion from './ExpansionPanel'
// import TwitterTimeline from '../TwitterTimeline'
// import useUSAState from '../utilities/useUSAState'
// import PrayingForTitle from './PrayingForTitle'
// import LeaderPhoto from './LeaderPhoto'
// import FacebookTimeline from '../FacebookTimeline'
// import { H2, H3, P, P2 } from '../utilities/formating'
// import EmailSignIn from '../SignIn/EmailSignIn'
// import { Divider } from '@mui/material'
// import DesktopOnly from '../DesktopOnly'
// import MobileOnly from '../MobileOnly'

export const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" className="p-3" hidden={value !== index}>
      {children}
    </div>
  )
}

export default function TabPanels({ tabIndex, post }) {
  const { stateCode, stateName } = useUSAState()

  return (
    <>
      <TabPanel value={tabIndex} index={0}>
        <div className="mb-1 text-center">
          {moment(post.dateID).format('dddd, MMMM Do')} test!
        </div>

        <PrayingForTitle dateID={post.dateID} />

        <div className="flex justify-around">
          <LeaderPhoto leader={post.leader1} />
          <LeaderPhoto leader={post.leader2} />
          <LeaderPhoto leader={post.leader3} />
        </div>

        <div className="my-2">
          <Accordion leader={post.leader1} />
          <Accordion leader={post.leader2} />
          <Accordion leader={post.leader3} />
        </div>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <Paper>
          <div className="p-2 text-center max-w-[440px]">
            <MobileOnly>
              <H3>Get on the Mailing List</H3>
            </MobileOnly>
            <DesktopOnly>
              <H2>Get on the Mailing List</H2>
            </DesktopOnly>
            <div className="p-1">
              <Divider />
              <div className="pt-3 pb-1">
                <P>
                  We will send you one email each morning with three legislators
                  from {stateName} to pray for.
                </P>
              </div>
              <EmailSignIn
                buttonText="Sign me up"
                sentMessage="We sent you a confirmation link.  Check your email now and click the link to confirm."
                errorMessage="Error sending you a confirmation link.  Please try again."
              />
            </div>
            <div className="px-1 py-3">
              <P2>
                (We won't spam you. You can, however, use your email to sign
                into the website and change your Mailing List settings.)
              </P2>
            </div>
          </div>
        </Paper>
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <Paper>
          <FacebookTimeline />
        </Paper>
      </TabPanel>

      <TabPanel value={tabIndex} index={3}>
        <Paper>
          <TwitterTimeline accountName={`Praying4_${stateCode}`} />
        </Paper>
      </TabPanel>

      <TabPanel value={tabIndex} index={4}>
        <Paper>Follow on Instagram</Paper>
      </TabPanel>
    </>
  )
}
