import React from 'react'

import {
  // SiX,
  SiFacebook,
} from 'react-icons/si'
import Image from 'next/image'

import type { Leader } from '@/lib/types'
import { leaderPhoto } from '@/lib/leader'

import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  // TableFooter,
  // TableHead,
  // TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Props {
  leader: Leader
}

export function LeaderProfile({ leader }: Props) {
  const name = `${leader.Title} ${leader.fullname}`

  return (
    <div className="bg-black px-2 pb-2 pt-4 md:pb-6 md:pt-8">
      <div className="mx-auto max-w-lg pt-4 md:pt-8">
        <div className="mb-2 rounded-t-lg bg-primary py-1 pt-4 text-primary-foreground md:pt-8">
          <div>{leader.Title}</div>
          <h2>{leader.fullname}</h2>
        </div>

        <div className="flex justify-center">
          <div className="m-4 rounded-md border-0 bg-secondary-foreground px-6 py-4">
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

        <div className="px-4 pb-2 pt-2 md:px-6 md:pb-6">
          {/* <WikiPageSummary leader={leader} /> */}
        </div>

        <div className="m-2" />

        <div>
          <div className="p-2">
            <Table>
              <TableBody>
                <Row field="Title:" value={leader.Title} />
                {/* <Row field="District:" value={leader.District} /> */}
                <Row field="In Office Since:" value={leader.ElectDate} />
                <Row field="Religion:" value={leader.Religion} />
                <Row field="Spouse:" value={leader.Spouse} />
                <Row field="Family:" value={leader.Family} />
                <Row field="Birthday" value={birthday(leader)} />
                {/* <Row field="Address:" value={<Address leader={leader} />} /> */}
                <Row field="Email:" value={leader.Email} />
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="p-2" />

        <div className="flex justify-around pb-2 md:pb-6">
          <Button asChild>
            <Link href={leader.Website}>Website</Link>
          </Button>
          <Button asChild>
            <Link href={leader.Facebook}>
              <SiFacebook />
            </Link>
          </Button>
          {/* <Button asChild>
            <Link href={leader.Twitter}>
              <SiX />
            </Link>
          </Button> */}
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

// const Address = ({ leader }: Props) => {
//   return (
//     <>
//       {leader.MailAddr1 && <div>{leader.MailAddr1}</div>}
//       {leader.MailAddr2 && <div>{leader.MailAddr2}</div>}
//       {leader.MailAddr3 && <div>{leader.MailAddr3}</div>}
//       {leader.MailAddr5 && <div>{leader.MailAddr5}</div>}
//     </>
//   )
// }
