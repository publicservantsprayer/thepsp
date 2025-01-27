import { Title } from '@/components/psp-admin/title'
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
import { DistrictEditDialog } from './district-edit-dialog'

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

  return (
    <div className="container">
      <Title>{state.name}</Title>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-4">
          <LegislativeBodyCard
            state={state}
            leaders={filterUSSenate(leaders)}
            districts={federalUpperDistricts}
            title="U.S. Senate"
            caption="United States Senate"
            jurisdiction="federal"
            legislativeChamber="upper"
          />
          <LegislativeBodyCard
            state={state}
            leaders={filterUSHouse(leaders)}
            districts={federalLowerDistricts}
            title="U.S. House"
            caption="United States House of Representatives"
            jurisdiction="federal"
            legislativeChamber="lower"
          />
          <StrayLeaders leaders={leaders} />
        </div>

        <div className="">
          <LegislativeBodyCard
            state={state}
            leaders={filterStateSenate(leaders)}
            districts={stateUpperDistricts}
            title={state.upperChamberName}
            caption={`${state.upperChamberName}`}
            jurisdiction="state"
            legislativeChamber="upper"
          />
        </div>

        <div className="">
          <LegislativeBodyCard
            state={state}
            leaders={filterStateHouse(leaders)}
            districts={stateLowerDistricts}
            title={state.lowerChamberName}
            caption={`${state.lowerChamberName}`}
            jurisdiction="state"
            legislativeChamber="lower"
          />
        </div>
      </div>
    </div>
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
}: {
  state: State
  leaders: Leader[]
  districts: District[]
  title?: string
  caption: string
  jurisdiction: Jurisdiction
  legislativeChamber: LegislativeChamber
}) {
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
                <DistrictEditDialog
                  state={state}
                  districts={districts}
                  jurisdiction={jurisdiction}
                  legislativeChamber={legislativeChamber}
                >
                  District
                </DistrictEditDialog>
              </TableHead>
              <TableHead className="py-2">Name</TableHead>
              <TableHead className="py-2"></TableHead>
              <TableHead className="py-2"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {districts.map((district, i) => {
              const leader = findDistrictLeader(leaders, district)
              return (
                <TableRow key={i}>
                  <TableCell className="py-2">{district.name}</TableCell>
                  <TableCell className="py-2">{leader?.fullname}</TableCell>
                  <TableCell className="py-2">
                    {leader?.District} - {leader?.Chamber}
                  </TableCell>
                  <TableCell className="py-2"></TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// split district name, get last part, convert to number, find leader with matching district
function findDistrictLeader(leaders: Leader[], district: District) {
  const getNumberFromName = (name: string) => {
    const lastPart = name.split(' ').pop()
    return parseInt(lastPart?.replace(/\D/g, '') || '0')
  }

  const districtNumber = getNumberFromName(district.name)

  const leader = leaders.find((leader) => {
    const leaderDistrictNumber = getNumberFromName(leader?.District || '')
    return leaderDistrictNumber === districtNumber
  })

  if (!leader) {
    console.log('no leader found for district: ', district)
  }
  return leader || null
}

function filterUSSenate(leaders: Leader[]) {
  return leaders.filter(
    (leader) => leader.LegType === 'FL' && leader.Chamber === 'S',
  )
}

function filterUSHouse(leaders: Leader[]) {
  return leaders.filter(
    (leader) => leader.LegType === 'FL' && leader.Chamber === 'H',
  )
}

function filterStateSenate(leaders: Leader[]) {
  return leaders.filter(
    (leader) => leader.LegType === 'SL' && leader.Chamber === 'S',
  )
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

// Sort districts by number from name
function sortByName(districts: District[]) {
  return districts.sort((a, b) => {
    const aNum = parseInt(a.name.split(' ').pop() || '0')
    const bNum = parseInt(b.name.split(' ').pop() || '0')
    return aNum - bNum
  })
}

function filterLeadersWithoutDistrict(leaders: Leader[]) {
  return leaders.filter((leader) => !leader.District)
}

function filterLeadersWithoutChamber(leaders: Leader[]) {
  return leaders.filter((leader) => !['S', 'H'].includes(leader.Chamber!))
}

function StrayLeaders({ leaders }: { leaders: Leader[] }) {
  const noDistrict = filterLeadersWithoutDistrict(leaders)
  const noChamber = filterLeadersWithoutChamber(leaders)

  if (noDistrict.length === 0 && noChamber.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stray Leaders</CardTitle>
      </CardHeader>
      <CardContent>
        {noDistrict.length > 0 && (
          <div>
            <h3>Missing District</h3>
            <ul>
              {noDistrict.map((leader) => (
                <li key={leader.ref.id}>
                  {leader.fullname} - {leader.LegType} - {leader.Chamber}
                </li>
              ))}
            </ul>
          </div>
        )}
        {noChamber.length > 0 && (
          <div>
            <h3>Missing Chamber</h3>
            <ul>
              {noChamber.map((leader) => (
                <li key={leader.ref.id}>
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
