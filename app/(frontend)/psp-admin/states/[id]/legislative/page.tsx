import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  getDistricts,
  getStateLeaders,
  mustGetState,
} from '@/lib/firebase/firestore'
import { validateStateCode } from '@/lib/get-state-info'
import { notFound } from 'next/navigation'
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
import { SquareX } from 'lucide-react'
import { DeleteLeaderDialog } from './delete-leader-dialog'
import { indianaHouseOfRepresentatives, indianaStateSenate } from './indiana'
import Link from 'next/link'
import { ExpandableContainerTitle } from '@/components/psp-admin/expandable-container-title'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function StatePage({ params }: Props) {
  const { id } = await params

  const stateCode = validateStateCode(id)
  if (!stateCode) return notFound()

  const state = await mustGetState(stateCode)

  const leaders = await getStateLeaders({
    stateCode,
  })

  const districts = await getDistricts(state)
  const federalUpperDistricts = sortByName(
    filterFederalUpperDistricts(districts),
  )
  const federalLowerDistricts = sortByName(
    filterFederalLowerDistricts(districts),
  )
  const stateUpperDistricts = sortByName(filterStateUpperDistricts(districts))
  const stateLowerDistricts = sortByName(filterStateLowerDistricts(districts))
  const usSenateLeaders = filterUSSenate(leaders)
  const usHouseLeaders = filterUSHouse(leaders)
  const stateSenateLeaders = filterStateSenate(leaders)
  const stateHouseLeaders = filterStateHouse(leaders)

  // remove leaders from leadersLeftOver
  const leadersLeftOver = leaders.filter(
    (leader) =>
      !usSenateLeaders.includes(leader) &&
      !usHouseLeaders.includes(leader) &&
      !stateSenateLeaders.includes(leader) &&
      !stateHouseLeaders.includes(leader),
  )

  return (
    <ExpandableContainerTitle title={state.name}>
      <div className="grid w-full grid-cols-3 gap-4">
        <div className="flex flex-col gap-4">
          <LegislativeBodyCard
            state={state}
            leaders={usSenateLeaders}
            districts={federalUpperDistricts}
            title="U.S. Senate"
            caption="United States Senate"
            jurisdiction="federal"
            legislativeChamber="upper"
          />
          <LegislativeBodyCard
            state={state}
            leaders={usHouseLeaders}
            districts={federalLowerDistricts}
            title="U.S. House"
            caption="United States House of Representatives"
            jurisdiction="federal"
            legislativeChamber="lower"
          />
          <StrayLeaders
            leaders={leaders}
            leadersLeftOver={leadersLeftOver}
            state={state}
          />
        </div>

        <div className="">
          <LegislativeBodyCard
            state={state}
            leaders={stateSenateLeaders}
            districts={stateUpperDistricts}
            title={state.upperChamberName}
            caption={`${state.upperChamberName}`}
            jurisdiction="state"
            legislativeChamber="upper"
            updatedInfo={indianaStateSenate}
          />
        </div>

        <div className="">
          <LegislativeBodyCard
            state={state}
            leaders={stateHouseLeaders}
            districts={stateLowerDistricts}
            title={state.lowerChamberName}
            caption={`${state.lowerChamberName}`}
            jurisdiction="state"
            legislativeChamber="lower"
            updatedInfo={indianaHouseOfRepresentatives}
          />
        </div>
      </div>
    </ExpandableContainerTitle>
  )
}

function LegislativeBodyCard({
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
                >
                  District
                </EditDistrictsDialog>
              </TableHead>
              <TableHead className="py-2">Name</TableHead>
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
                      oldLeaders={oldDistrictLeaders}
                      jurisdiction={jurisdiction}
                      legislativeChamber={legislativeChamber}
                    >
                      {district.name}
                    </DistrictManageDialog>
                  </TableCell>
                  <TableCell className="py-2">
                    {districtLeaders.map((leader, index) => (
                      <div key={index}>{leader?.fullname}</div>
                    ))}
                    {oldDistrictLeaders.map((leader, index) => (
                      <div key={index} className="text-muted-foreground">
                        {leader?.fullname}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="py-2">
                    {/* {districtLeaders.map((leader, index) => (
                      <div key={index}>
                        {leader?.District} - {leader?.Chamber}
                      </div>
                    ))} */}
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

// Sort districts by number from name
function sortByName(districts: District[]) {
  return districts.sort((a, b) => {
    const aNum = parseInt(a.name.split(' ').pop() || '0')
    const bNum = parseInt(b.name.split(' ').pop() || '0')
    return aNum - bNum
  })
}

function filterUSSenate(leaders: Leader[]) {
  const filteredLeaders = leaders.filter(
    (leader) => leader.LegType === 'FL' && leader.Chamber === 'S',
  )
  // remove leaders from leadersLeftOver
  return filteredLeaders
}

function filterUSHouse(leaders: Leader[]) {
  return leaders.filter(
    (leader) => leader.LegType === 'FL' && leader.Chamber === 'H',
  )
}

function filterStateSenate(leaders: Leader[]) {
  return leaders.filter((leader) => {
    if (leader.LegType === 'SL' && leader.Chamber === 'S') {
      return true
    }
    if (
      leader.branch === 'legislative' &&
      leader.jurisdiction === 'state' &&
      leader.legislativeChamber === 'upper'
    ) {
      return true
    }
  })
}

function filterStateHouse(leaders: Leader[]) {
  return leaders.filter(
    (leader) => leader.LegType === 'SL' && leader.Chamber === 'H',
  )
}

function filterFederalUpperDistricts(districts: District[]) {
  return districts.filter(
    (district) =>
      district.jurisdiction === 'federal' &&
      district.legislativeChamber === 'upper',
  )
}

function filterFederalLowerDistricts(districts: District[]) {
  return districts.filter(
    (district) =>
      district.jurisdiction === 'federal' &&
      district.legislativeChamber === 'lower',
  )
}

function filterStateUpperDistricts(districts: District[]) {
  return districts.filter(
    (district) =>
      district.jurisdiction === 'state' &&
      district.legislativeChamber === 'upper',
  )
}

function filterStateLowerDistricts(districts: District[]) {
  return districts.filter(
    (district) =>
      district.jurisdiction === 'state' &&
      district.legislativeChamber === 'lower',
  )
}

function filterLeadersWithoutDistrict(leaders: Leader[]) {
  return leaders.filter((leader) => !leader.District)
}

function filterLeadersWithoutChamber(leaders: Leader[]) {
  return leaders.filter((leader) => !['S', 'H'].includes(leader.Chamber!))
}

function StrayLeaders({
  leaders,
  leadersLeftOver,
  state,
}: {
  leaders: Leader[]
  leadersLeftOver: Leader[]
  state: State
}) {
  const noDistrict = filterLeadersWithoutDistrict(leaders)
  const noChamber = filterLeadersWithoutChamber(leaders)

  if (noDistrict.length === 0 && noChamber.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stray Leaders</CardTitle>
      </CardHeader>
      <CardContent>
        {leadersLeftOver.length > 0 && (
          <div>
            <h3>Left Over</h3>
            <ul>
              {leadersLeftOver.map((leader) => (
                <li key={leader.ref.id}>
                  <DeleteLeaderDialog state={state} leader={leader}>
                    <SquareX size={16} />
                  </DeleteLeaderDialog>
                  {leader.fullname} - {leader.LegType} - {leader.Chamber}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
