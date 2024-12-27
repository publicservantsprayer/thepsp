import React from 'react'
import Typography from '@mui/material/Typography'
import MuiButton from '@mui/material/Button'
import WebIcon from '@mui/icons-material/Web'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Image from 'next/image'

import type { Leader } from '@/lib/types'
import { leaderPhoto } from '@/lib/leader'
import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'

interface Props {
  leader: Leader
}

export function LeaderProfile({ leader }: Props) {
  const name = `${leader.Title} ${leader.NickName} ${leader.LastName}`

  return (
    <div className="bg-black px-2 pt-4 md:pt-8 pb-2 md:pb-6">
      <div className="max-w-lg mx-auto pt-4 md:pt-8">
        <Paper>
          <div className="py-1 mb-2 bg-primary text-primary-foreground rounded-t-lg pt-4 md:pt-8">
            <Typography variant="overline">{leader.Title}</Typography>
            <Typography variant="h3" component="h1" gutterBottom>
              {leader.NickName} {leader.LastName}
            </Typography>
          </div>

          <div className="flex justify-center">
            <div className="m-4 py-4 px-6 border-0 bg-secondary-foreground rounded-md">
              {leader.StateCode && (
                <Image
                  src={leaderPhoto(leader)}
                  alt={name}
                  width={108}
                  height={148}
                  className="rounded-lg"
                />
              )}
            </div>
          </div>

          <div className="px-4 md:px-6 pt-2 pb-2 md:pb-6">
            {/* <WikiPageSummary leader={leader} /> */}
          </div>
        </Paper>

        <div className="m-2" />

        <div>
          <Paper>
            <div className="p-2">
              <Table size="small">
                <TableBody>
                  <Row field="Title:" value={leader.Title} />
                  <Row field="District:" value={leader.District} />
                  <Row field="In Office Since:" value={leader.ElectDate} />
                  <Row field="Religion:" value={leader.Religion} />
                  <Row field="Spouse:" value={leader.Spouse} />
                  <Row field="Family:" value={leader.Family} />
                  <Row field="Birthday" value={birthday(leader)} />
                  <Row field="Address:" value={<Address leader={leader} />} />
                  <Row field="Email:" value={leader.Email} />
                </TableBody>
              </Table>
            </div>
          </Paper>
        </div>

        <div className="p-2" />

        <div className="pb-2 md:pb-6 flex justify-around">
          <Button href={leader.Website} icon={WebIcon}>
            Website
          </Button>
          <Button href={leader.Facebook} icon={FacebookIcon}>
            Facebook
          </Button>
          <Button href={leader.Twitter} icon={TwitterIcon}>
            Twitter
          </Button>
        </div>
      </div>
    </div>
  )
}

const birthday = (leader: Leader) => {
  const month = leader.BirthDate
  const day = leader.BirthMonth
  if (!month || !day) return null
  const date = new Date(2020, Number(month) - 1, Number(day))

  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

const Row = ({
  field,
  value,
}: {
  field: string
  value: string | React.ReactNode
}) => {
  if (!value) return null

  return (
    <TableRow>
      <TableCell>{field}</TableCell>
      <TableCell>{value}</TableCell>
    </TableRow>
  )
}

const Address = ({ leader }: Props) => {
  return (
    <>
      {leader.MailAddr1 && <div>{leader.MailAddr1}</div>}
      {leader.MailAddr2 && <div>{leader.MailAddr2}</div>}
      {leader.MailAddr3 && <div>{leader.MailAddr3}</div>}
      {leader.MailAddr5 && <div>{leader.MailAddr5}</div>}
    </>
  )
}

interface ButtonProps {
  children: React.ReactNode
  href: string
  icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
    muiName: string
  }
}

const Button = ({ children, href, icon }: ButtonProps) => {
  const StartIcon = icon
  return (
    <div className="m-1">
      <MuiButton
        variant="contained"
        color="primary"
        href={href}
        startIcon={<StartIcon />}
      >
        {children}
      </MuiButton>
    </div>
  )
}
