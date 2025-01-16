import type { AdminViewProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import React from 'react'
import { stateCodes } from '@/data/states'
import { getLeadersWithoutPhoto } from '@/lib/firebase/firestore'
import { Leader, StateCode } from '@/lib/types'
import { getStateInfo } from '@/lib/get-state-info'
import { CheckLeadersForPhotoButton } from '../../../app/(frontend)/psp-admin/leaders/check-leader-images'

export async function LeadersView({
  initPageResult,
  params,
  searchParams,
}: AdminViewProps) {
  const stateLeaders = {} as Record<StateCode, Leader[]>

  await Promise.all(
    stateCodes.map(async (stateCode) => {
      stateLeaders[stateCode] = await getLeadersWithoutPhoto(stateCode)
    }),
  )

  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <h1>Leaders</h1>
        <div>
          {stateCodes.map((stateCode) => (
            <div key={stateCode}>
              <h2 className="!text-sm">{getStateInfo(stateCode).stateName}</h2>
              <ul>
                {stateLeaders[stateCode].map((leader) => (
                  <li key={leader.id} className="text-xs">
                    {leader.FirstName} {leader.LastName} {leader.PhotoFile}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <CheckLeadersForPhotoButton />
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
