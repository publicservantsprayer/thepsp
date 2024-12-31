import React from 'react'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'

import { leaderPhoto, leaderUrl } from '@/lib/leader'
import { Leader } from '@/lib/types'
import { Link } from '@/components/ui/link'

interface Props {
  leaders: Leader[]
  chamber: Leader['Chamber']
  legType: Leader['LegType']
}

export const Leaders = ({ leaders, chamber, legType }: Props) => {
  if (!leaders) return null

  function alphabetical(leaderA: Leader, leaderB: Leader) {
    if (leaderA.LastName < leaderB.LastName) {
      return -1
    }
    if (leaderA.LastName > leaderB.LastName) {
      return 1
    }
    return 0
  }

  leaders.sort(alphabetical)

  leaders = leaders.filter((leader) => {
    return leader.Chamber === chamber && leader.LegType === legType
  })

  return (
    <>
      {leaders.map((leader) => (
        <div key={leader.PID} className="m-1">
          <Link href={leaderUrl(leader)}>
            <Paper>
              <div className="p-1">
                <div className="flex min-w-[145px] justify-center">
                  <Avatar
                    alt={leader.PhotoFile}
                    src={leaderPhoto(leader)}
                    className="m-[10px] h-[60px] w-[60px]"
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
