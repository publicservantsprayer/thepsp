import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  District,
  Jurisdiction,
  Leader,
  LegislativeChamber,
  State,
} from '@/lib/types'
import { EditDistrictsDialog } from './edit-districts-dialog'
import React from 'react'
import { DistrictManageDialog } from './district-manage-dialog'
import Link from 'next/link'
import { LeaderCardDialog } from '@/components/psp-admin/leader-card-dialog'
import { LeaderTooltip } from '@/components/psp-admin/leader-tooltip'
import { CircleChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LegislativeBodyCard({
  state,
  leaders,
  districts,
  title,
  caption,
  jurisdiction,
  legislativeChamber,
  updatedInfo,
}: {
  state: State
  leaders: Leader[]
  districts: District[]
  title?: string
  caption: string
  jurisdiction: Jurisdiction
  legislativeChamber: LegislativeChamber
  updatedInfo?: {
    districtName: string
    leaderName: string
    leaderURL: string
    dateElected: string
  }[]
}) {
  const leadersToLineUp: Leader[] = []
  districts.forEach((district) => {
    const districtLeaders = findDistrictLeaders(leaders, district)
    const oldDistrictLeaders = findOldDistrictLeaders(leaders, district)
    const readyToLineUpLeaders = oldDistrictLeaders
      .filter(
        (leader) =>
          !districtLeaders.some(
            (newLeader) => newLeader.ref.id === leader.ref.id,
          ),
      )
      .map((leader) => ({
        ...leader,
        districtRef: district.ref,
        districtName: district.name,
        jurisdiction,
        legislativeChamber,
        branch: 'legislative' as const,
      }))
    leadersToLineUp.push(...readyToLineUpLeaders)
  })

  let prevDistrictNumber = 0
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>{caption}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="py-2">
                <EditDistrictsDialog
                  state={state}
                  districts={districts}
                  jurisdiction={jurisdiction}
                  legislativeChamber={legislativeChamber}
                  leadersToLineUp={leadersToLineUp}
                >
                  District
                </EditDistrictsDialog>
              </TableHead>
              <TableHead className="py-2">Name</TableHead>
              <TableHead className="py-2">Old Leg</TableHead>
              <TableHead className="py-2">Current</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {districts.map((district, i) => {
              const districtLeaders = findDistrictLeaders(leaders, district)
              const oldDistrictLeaders = findOldDistrictLeaders(
                leaders,
                district,
              )
              const onlyOldDistrictLeaders = oldDistrictLeaders.filter(
                (leader) =>
                  !districtLeaders.some(
                    (newLeader) => newLeader.ref.id === leader.ref.id,
                  ),
              )
              const districtNumber = getNumberFromName(district.name)
              const missingOrDuplicate =
                prevDistrictNumber !== districtNumber - 1
              prevDistrictNumber = districtNumber
              return (
                <TableRow
                  key={i}
                  className="group"
                  data-dup={missingOrDuplicate}
                >
                  <TableCell className="py-2 group-data-[dup=true]:text-yellow-500">
                    <DistrictManageDialog
                      state={state}
                      district={district}
                      leaders={districtLeaders}
                      oldLeaders={onlyOldDistrictLeaders}
                      jurisdiction={jurisdiction}
                      legislativeChamber={legislativeChamber}
                    >
                      {district.name}
                    </DistrictManageDialog>
                  </TableCell>
                  <TableCell className="py-2">
                    {districtLeaders.map((leader, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <LeaderCardDialog
                          leader={leader}
                          state={state}
                          districts={districts}
                          asChild
                        >
                          <Button size="xs" variant="link">
                            <CircleChevronUp />
                          </Button>
                        </LeaderCardDialog>
                        <LeaderTooltip leader={leader} state={state}>
                          {leader?.fullname}
                        </LeaderTooltip>
                      </div>
                    ))}
                    {onlyOldDistrictLeaders.map((leader, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <LeaderCardDialog
                          leader={leader}
                          state={state}
                          districts={districts}
                          asChild
                        >
                          <Button size="xs" variant="link">
                            <CircleChevronUp />
                          </Button>
                        </LeaderCardDialog>
                        <LeaderTooltip leader={leader} state={state}>
                          {leader?.fullname}
                        </LeaderTooltip>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="py-2">
                    {districtLeaders.map((leader, index) => (
                      <div key={index}>
                        {leader?.District} - {leader?.Chamber}
                      </div>
                    ))}
                    {onlyOldDistrictLeaders.map((leader, index) => (
                      <div key={index}>
                        {leader?.District} - {leader?.Chamber}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="py-2">
                    <Link
                      href={updatedInfo?.[i]?.leaderURL || '#'}
                      target="_blank"
                    >
                      {updatedInfo?.[i]?.leaderName}
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Find the number at the end of the district name
const getNumberFromName = (name: string) => {
  const lastPart = name.split(' ').pop()
  return parseInt(lastPart?.replace(/\D/g, '') || '0')
}

function findDistrictLeaders(leaders: Leader[], district: District) {
  const districtLeaders = leaders.filter((leader) => {
    return leader.districtRef?.id === district.ref.id
  })

  return districtLeaders
}

function findOldDistrictLeaders(leaders: Leader[], district: District) {
  const districtNumber = getNumberFromName(district.name)

  const districtLeaders = leaders.filter((leader) => {
    const leaderDistrictNumber = getNumberFromName(leader?.District || '')
    return leaderDistrictNumber === districtNumber
  })

  if (!districtLeaders.length) {
    // console.log('no leader found for district: ', district)
  }
  return districtLeaders || null
}
