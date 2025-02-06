import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { District, Leader, State } from '@/lib/types'
import { SquareX } from 'lucide-react'
import React from 'react'
import { DeleteLeaderDialog } from './delete-leader-dialog'
import { LeaderCardDialog } from '@/components/psp-admin/leader-card-dialog'
import { LeaderPhoto } from '@/components/psp-admin/leader-photo'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function filterLeadersWithoutOldDistrict(leaders: Leader[]) {
  return leaders.filter((leader) => !leader.District && !leader.districtRef)
}

function filterLeadersWithoutOldChamber(leaders: Leader[]) {
  return leaders.filter(
    (leader) =>
      !['S', 'H'].includes(leader.Chamber!) && !leader.legislativeChamber,
  )
}

interface StrayLeadersProps {
  leaders: Leader[]
  leadersLeftOver: Leader[]
  state: State
  districts: District[]
}

export function StrayLeaders({
  leaders,
  leadersLeftOver,
  state,
  districts,
}: StrayLeadersProps) {
  const noDistrict = filterLeadersWithoutOldDistrict(leaders)
  const noChamber = filterLeadersWithoutOldChamber(leaders)

  return (
    <Card>
      <CardHeader className="mb-2">
        <CardTitle>Stray Leaders</CardTitle>
        <CardDescription>
          {state.name} leaders in prayer rotation that are not assigned an
          office.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <LeaderTable
          leaders={leadersLeftOver}
          state={state}
          districts={districts}
          title="Left Over"
        />
        <LeaderTable
          leaders={noDistrict}
          state={state}
          districts={districts}
          title="Leaders Without Old District"
        />
        <LeaderTable
          leaders={noChamber}
          state={state}
          districts={districts}
          title="Leaders Without Old Chamber"
        />
      </CardContent>
    </Card>
  )
}

interface LeaderTableProps {
  leaders: Leader[]
  state: State
  districts: District[]
  title: string
  showResidence?: boolean
}

function LeaderTable({ leaders, state, districts, title }: LeaderTableProps) {
  if (leaders.length === 0) return null

  return (
    <div>
      <h3 className="font-bold">{title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-2"></TableHead>
            <TableHead className="py-2">Name</TableHead>
            <TableHead className="py-2">Residence</TableHead>
            <TableHead className="py-2"></TableHead>
          </TableRow>
        </TableHeader>
        <TableCaption></TableCaption>
        <TableBody>
          {leaders.map((leader) => (
            <TableRow key={leader.ref.id}>
              <TableCell className="py-2">
                <DeleteLeaderDialog state={state} leader={leader}>
                  <SquareX size={16} />
                </DeleteLeaderDialog>
              </TableCell>
              <TableCell className="py-2">
                <LeaderCardDialog
                  leader={leader}
                  state={state}
                  districts={districts}
                >
                  <span className="hover:underline">
                    {leader.Prefix}
                    {leader.fullname}
                  </span>
                </LeaderCardDialog>
              </TableCell>
              <TableCell className="py-2">{leader.Residence}</TableCell>
              <TableCell className="py-2">
                <LeaderPhoto leader={leader} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
