import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  getDistricts,
  getStateLeaders,
  mustGetState,
} from '@/lib/firebase/firestore'
import { validateStateCode } from '@/lib/get-state-info'
import { notFound } from 'next/navigation'
import { District, Leader, State } from '@/lib/types'
import React from 'react'
import { SquareX } from 'lucide-react'
import { DeleteLeaderDialog } from './delete-leader-dialog'
import { indianaHouseOfRepresentatives, indianaStateSenate } from './indiana'
import { ExpandableContainerTitle } from '@/components/psp-admin/expandable-container-title'
import { LegislativeBodyCard } from './legislative-body-card'
import { LeaderCardDialog } from '@/components/psp-admin/leader-card-dialog'

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
            districts={districts}
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

function filterLeadersWithoutOldDistrict(leaders: Leader[]) {
  return leaders.filter((leader) => !leader.District && !leader.districtRef)
}

function filterLeadersWithoutOldChamber(leaders: Leader[]) {
  return leaders.filter(
    (leader) =>
      !['S', 'H'].includes(leader.Chamber!) && !leader.legislativeChamber,
  )
}

function StrayLeaders({
  leaders,
  leadersLeftOver,
  state,
  districts,
}: {
  leaders: Leader[]
  leadersLeftOver: Leader[]
  state: State
  districts: District[]
}) {
  const noDistrict = filterLeadersWithoutOldDistrict(leaders)
  const noChamber = filterLeadersWithoutOldChamber(leaders)

  // if (noDistrict.length === 0 && noChamber.length === 0) return null

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
                  <LeaderCardDialog
                    leader={leader}
                    state={state}
                    districts={districts}
                  >
                    {leader.fullname}
                  </LeaderCardDialog>
                </li>
              ))}
            </ul>
          </div>
        )}
        {noDistrict.length > 0 && (
          <div>
            <h3>Leaders Without Old District</h3>
            <ul>
              {noDistrict.map((leader) => (
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
        {noChamber.length > 0 && (
          <div>
            <h3>Leaders Without Old Chamber</h3>
            <ul>
              {noChamber.map((leader) => (
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
