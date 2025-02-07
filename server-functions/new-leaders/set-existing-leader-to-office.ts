'use server'

import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import {
  District,
  LegislativeChamber,
  Jurisdiction,
  State,
  Branch,
} from '@/lib/types'
import { revalidatePath } from 'next/cache'
import { Leader } from '@/lib/types'
import {
  getAnyStateLeaderByPermaLink,
  mergeUpdateLeader,
  mustGetRootLeaderByPermaLink,
  saveLeaderToBothRootAndStateCollections,
  saveNewLeaderToStateCollection,
} from '@/lib/firebase/firestore/leaders'

export const serverSetExistingLeaderToOffice = async ({
  rootLeaderPermaLink,
  state,
  branch,
  district,
  legislativeChamber,
  jurisdiction,
  revalidatePath: path,
}: {
  rootLeaderPermaLink: string
  state: State
  branch: Branch
  district: District
  legislativeChamber: LegislativeChamber
  jurisdiction: Jurisdiction
  revalidatePath?: string
}) => {
  mustGetCurrentAdmin()

  const existingRootLeader =
    await mustGetRootLeaderByPermaLink(rootLeaderPermaLink)

  // Check if a leader with this permaLink already exists in any state
  const existingStateLeader = await getAnyStateLeaderByPermaLink(
    existingRootLeader.permaLink,
  )
  if (existingStateLeader) {
    return {
      success: false,
      error: `${existingStateLeader.StateCode} leader already exists with this permaLink: ${existingStateLeader.permaLink}`,
    }
  }

  // Save the root leader to a new leader in the state collection
  await saveNewLeaderToStateCollection({
    existingRootLeader: {
      ...existingRootLeader,
      jurisdiction,
      branch,
      legislativeChamber,
      districtRef: district.ref,
      StateCode: state.ref.id,
      LegType: '',
      Chamber: '',
      District: '',
      DistrictID: '',
    },
    state,
  })

  // Update the leader with the new office information
  const { rootLeader, stateLeader } = await mergeUpdateLeader({
    permaLink: existingRootLeader.permaLink,
    leaderData: {
      jurisdiction,
      branch,
      legislativeChamber,
      districtRef: district.ref,
      StateCode: state.ref.id,
      LegType: '',
      Chamber: '',
      District: '',
      DistrictID: '',
    },
  })

  if (path) {
    revalidatePath(path)
  }

  return { success: true, rootLeader, stateLeader }
}
