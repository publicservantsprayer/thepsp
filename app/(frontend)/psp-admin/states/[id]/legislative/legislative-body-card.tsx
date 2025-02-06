'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
  Branch,
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
import missingPhoto from '@/public/images/no-image.jpg'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical } from 'lucide-react'

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
  const branch: Branch = 'legislative'
  const [showDistrict, setShowDistrict] = React.useState(true)
  const [showPrefix, setShowPrefix] = React.useState(false)
  const [showTitle, setShowTitle] = React.useState(false)
  const [showName, setShowName] = React.useState(true)
  const [showHasPhoto, setShowHasPhoto] = React.useState(false)
  const [showCurrentLeg, setShowCurrentLeg] = React.useState(false)
  const [showOldLeg, setShowOldLeg] = React.useState(false)

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
      <CardHeader className="relative flex flex-row justify-between">
        <CardTitle className="">{title}</CardTitle>
        <CardDescription></CardDescription>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showDistrict}
              onCheckedChange={setShowDistrict}
            >
              District
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showPrefix}
              onCheckedChange={setShowPrefix}
            >
              Prefix
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showTitle}
              onCheckedChange={setShowTitle}
            >
              Title
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showName}
              onCheckedChange={setShowName}
            >
              Name
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showHasPhoto}
              onCheckedChange={setShowHasPhoto}
            >
              Photo
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showCurrentLeg}
              onCheckedChange={setShowCurrentLeg}
            >
              Current Legislators
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showOldLeg}
              onCheckedChange={setShowOldLeg}
            >
              Old Legislator ID
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
                  <span className="hover:underline">District</span>
                </EditDistrictsDialog>
              </TableHead>
              {showPrefix && <TableHead className="py-2">Prefix</TableHead>}
              {showTitle && <TableHead className="py-2">Title</TableHead>}
              <TableHead className="py-2">Name</TableHead>
              {showOldLeg && <TableHead className="py-2">Old Leg</TableHead>}
              {showCurrentLeg && (
                <TableHead className="py-2">Current</TableHead>
              )}
              {showHasPhoto && <TableHead className="w-16 py-2"></TableHead>}
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
                  {/* District */}
                  <TableCell className="py-2 group-data-[dup=true]:text-yellow-500">
                    <DistrictManageDialog
                      state={state}
                      district={district}
                      leaders={districtLeaders}
                      oldLeaders={onlyOldDistrictLeaders}
                      jurisdiction={jurisdiction}
                      legislativeChamber={legislativeChamber}
                      branch={branch}
                    >
                      <span className="hover:underline">{district.name}</span>
                    </DistrictManageDialog>
                  </TableCell>

                  {/* Prefix */}
                  {showPrefix && (
                    <TableCell className="py-2 text-left">
                      {districtLeaders.map((leader, index) => (
                        <div key={index}>{leader?.Prefix}</div>
                      ))}
                    </TableCell>
                  )}

                  {/* Title */}
                  {showTitle && (
                    <TableCell className="py-2 text-left">
                      {districtLeaders.map((leader, index) => (
                        <div key={index}>{leader?.Title}</div>
                      ))}
                    </TableCell>
                  )}

                  {/* Name */}
                  <TableCell className="py-2 text-left">
                    {districtLeaders.map((leader, index) => (
                      <div key={index} className="flex gap-2">
                        <LeaderCardDialog
                          leader={leader}
                          state={state}
                          districts={districts}
                        >
                          <span className="hover:underline">
                            {leader?.fullname}
                          </span>
                        </LeaderCardDialog>
                      </div>
                    ))}
                    {onlyOldDistrictLeaders.map((leader, index) => (
                      <div
                        key={index}
                        className="flex gap-2 text-muted-foreground"
                      >
                        <LeaderCardDialog
                          leader={leader}
                          state={state}
                          districts={districts}
                        >
                          {leader?.fullname}
                        </LeaderCardDialog>
                      </div>
                    ))}
                  </TableCell>

                  {/* Old Leg */}
                  {showOldLeg && (
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
                  )}

                  {/* Current Leg */}
                  {showCurrentLeg && (
                    <TableCell className="py-2">
                      <Link
                        href={updatedInfo?.[i]?.leaderURL || '#'}
                        target="_blank"
                      >
                        {updatedInfo?.[i]?.leaderName}
                      </Link>
                    </TableCell>
                  )}

                  {/* Photo */}
                  {showHasPhoto && (
                    <TableCell className="py-2 text-right">
                      {districtLeaders.map((leader, index) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={index}
                          src={
                            leader.hasPhoto
                              ? `/images/leader-photo/thumbnail/${leader.PhotoFile}`
                              : missingPhoto.src
                          }
                          alt="Thumbnail"
                          className="h-[37px] w-[27px] rounded"
                          onError={(e) => {
                            e.currentTarget.onerror = null // Prevent looping if the fallback image fails to load
                            e.currentTarget.src = missingPhoto.src
                          }}
                        />
                      ))}
                    </TableCell>
                  )}
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
