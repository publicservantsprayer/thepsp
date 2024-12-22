import React from 'react'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'

import { Leader, leaderPhoto, leaderUrl } from '@/lib/leader'
import { useStateLeaders } from '@/lib/firebase/firebase'
import { Link } from '@/components/ui/link'

const useStyles = makeStyles({
  avatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
})

interface ActualLeadersProps {
  leaders: Leader[]
}

const ActualLeaders = ({ leaders }: ActualLeadersProps) => {
  const classes = useStyles()

  if (!leaders) return null

  function compare(leaderA: Leader, leaderB: Leader) {
    if (leaderA.LastName < leaderB.LastName) {
      return -1
    }
    if (leaderA.LastName > leaderB.LastName) {
      return 1
    }
    return 0
  }

  leaders.sort(compare)

  return (
    <>
      {leaders.map((leader) => (
        <div key={leader.PID} className="m-1">
          <Link href={leaderUrl(leader)}>
            <Paper>
              <div className="p-1">
                <div className="min-w-[145px] flex justify-center">
                  <Avatar
                    alt={leader.PhotoFile}
                    src={leaderPhoto(leader)}
                    className={classes.avatar}
                  />
                </div>
                <Typography
                  variant="body2"
                  component="div"
                  align="center"
                  noWrap
                >
                  {leader.NickName} {leader.LastName}
                </Typography>
              </div>
            </Paper>
          </Link>
        </div>
      ))}
    </>
  )
}

interface FakeLeadersProps {
  leaders: any[]
  legType: string
  chamber: string
}

const FakeLeaders = ({ leaders, legType, chamber }: FakeLeadersProps) => {
  const classes = useStyles()

  return (
    <>
      {leaders.map((_, i) => (
        <div key={i} className="m-1">
          <Paper>
            <div className="p-1">
              <div className="min-w-[145px] flex justify-center">
                <Skeleton variant="circular" className={classes.avatar} />
              </div>
              <div className="flex justify-center">
                <Skeleton width={100} height={6} style={{ margin: 8 }} />
              </div>
            </div>
          </Paper>
        </div>
      ))}
    </>
  )
}

interface LeadersProps {
  stateCode: string
}

export function Leaders(props: LeadersProps) {
  // const [leaders, loading] = useStateLeaders(props)
  const leaders = []
  const fakeLeaders = new Array(10).fill({})
  return null

  return <ActualLeaders leaders={leaders} {...props} />
}
