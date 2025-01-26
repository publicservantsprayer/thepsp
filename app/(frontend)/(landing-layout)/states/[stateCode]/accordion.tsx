'use client'

import moment from 'moment'
import { Post, PostLeader } from '@/lib/types'

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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const birthday = (leader: PostLeader) => {
  const day = leader.BirthDate
  const month = leader.BirthMonth
  if (!month || !day) return null

  const birthdate = moment(`2020-${month}-${day}`)
  if (!birthdate.isValid()) return null

  return birthdate.format('MMMM Do')
}

function TableRowCell({ name, data }: { name: string; data: React.ReactNode }) {
  if (!data) return null

  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>{data}</TableCell>
    </TableRow>
  )
}

const LeaderName = ({ leader }: { leader: PostLeader }) => {
  return (
    <div>
      {leader.Prefix} {leader.NickName} {leader.LastName}
    </div>
  )
}

export function LeaderAccordion({ post }: { post: Post }) {
  const { leader1, leader2, leader3 } = post

  return (
    <Accordion type="single" collapsible className="w-full">
      {[leader1, leader2, leader3].map((leader) => (
        <AccordionItem value={leader.permaLink} key={leader.permaLink}>
          <AccordionTrigger>
            <LeaderName leader={leader} />
          </AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableBody>
                <TableRowCell name="Title" data={leader.Title} />
                <TableRowCell name="District:" data={leader.District} />
                <TableRowCell name="In Office Since:" data={leader.ElectDate} />
                <TableRowCell name="Religion:" data={leader.Religion} />
                <TableRowCell name="Spouse:" data={leader.Spouse} />
                <TableRowCell name="Family:" data={leader.Family} />
                <TableRowCell name="Birthday" data={birthday(leader)} />
                <TableRowCell name="Email:" data={leader.Email} />
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
