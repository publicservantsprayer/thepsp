import {
  getDistricts,
  getStateLeaders,
  mustGetState,
} from '@/lib/firebase/firestore'
import { validateStateCode } from '@/lib/get-state-info'
import { notFound } from 'next/navigation'
import { District, Leader } from '@/lib/types'
import React from 'react'
import { indianaHouseOfRepresentatives, indianaStateSenate } from './indiana'
import { ExpandableContainer } from '@/components/psp-admin/expandable-container'
import { LegislativeBodyCard } from './legislative-body-card'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { StrayLeaders } from './stray-leaders'
import { StateSettings } from './state-settings'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function StatePage({ params }: Props) {
  await mustGetCurrentAdmin()

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
    <ExpandableContainer
      title={state.name}
      buttons={<StateSettings state={state} />}
    >
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
    </ExpandableContainer>
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
  const filteredLeaders = leaders.filter((leader) => {
    if (leader.LegType === 'FL' && leader.Chamber === 'S') {
      return true
    }
    if (
      leader.branch === 'legislative' &&
      leader.jurisdiction === 'federal' &&
      leader.legislativeChamber === 'upper'
    ) {
      return true
    }
  })
  return filteredLeaders
}

function filterUSHouse(leaders: Leader[]) {
  return leaders.filter((leader) => {
    if (leader.LegType === 'FL' && leader.Chamber === 'H') {
      return true
    }
    if (
      leader.branch === 'legislative' &&
      leader.jurisdiction === 'federal' &&
      leader.legislativeChamber === 'lower'
    ) {
      return true
    }
  })
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
  return leaders.filter((leader) => {
    if (leader.LegType === 'SL' && leader.Chamber === 'H') {
      return true
    }
    if (
      leader.branch === 'legislative' &&
      leader.jurisdiction === 'state' &&
      leader.legislativeChamber === 'lower'
    ) {
      return true
    }
  })
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
