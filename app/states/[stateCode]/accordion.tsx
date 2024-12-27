'use client'

import React, { useState } from 'react'

import MuiAccordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import MuiTableRow from '@mui/material/TableRow'
import Skeleton from '@mui/material/Skeleton'
import moment from 'moment'
import { Leader } from '@/lib/types'

interface Props {
  leader: Leader
}

const birthday = (leader: Leader) => {
  const day = leader.BirthDate
  const month = leader.BirthMonth
  if (!month || !day) return null

  const birthdate = moment(`2020-${month}-${day}`)
  if (!birthdate.isValid()) return null

  return birthdate.format('MMMM Do')
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

function TableRow({ name, data }: { name: string; data: React.ReactNode }) {
  if (!data) return null

  return (
    <MuiTableRow>
      <TableCell>{name}</TableCell>
      <TableCell>{data}</TableCell>
    </MuiTableRow>
  )
}

const LeaderName = ({ leader }: Props) => {
  return leader.PID ? (
    <Typography>
      {leader.Prefix} {leader.NickName} {leader.LastName}
    </Typography>
  ) : (
    <Skeleton width={300} height={6} style={{ margin: 0 }} />
  )
}

export function Accordion({ leader }: { leader: Leader }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <MuiAccordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <LeaderName leader={leader} />
      </AccordionSummary>
      <AccordionDetails>
        <Table size="small">
          <TableBody>
            <TableRow name="Title" data={leader.Title} />
            <TableRow name="District:" data={leader.District} />
            <TableRow name="In Office Since:" data={leader.ElectDate} />
            <TableRow name="Religion:" data={leader.Religion} />
            <TableRow name="Spouse:" data={leader.Spouse} />
            <TableRow name="Family:" data={leader.Family} />
            <TableRow name="Birthday" data={birthday(leader)} />
            <TableRow name="Address:" data={<Address leader={leader} />} />
            <TableRow name="Email:" data={leader.Email} />
          </TableBody>
        </Table>
      </AccordionDetails>
    </MuiAccordion>
  )
}
