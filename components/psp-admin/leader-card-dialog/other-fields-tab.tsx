'use client'

import { Button } from '@/components/ui/button'
import { Code } from '@/payload/blocks/Code/Component.client'
import { useLeaderData } from './use-leader-data'
import { Leader } from '@/lib/types'

export function OtherFieldsTab() {
  const { rootLeader, stateLeader, isLoading, getRootAndStateLeader } =
    useLeaderData()

  const sortObjectProperties = (obj: Leader | undefined) => {
    if (!obj) return null
    return Object.fromEntries(
      Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)),
    ) as Leader
  }

  const sortedRootLeader = sortObjectProperties(rootLeader)
  const sortedStateLeader = sortObjectProperties(stateLeader)

  return (
    <div className="my-4 flex flex-col gap-4">
      <Button
        variant="outline"
        className="w-fit"
        loading={isLoading}
        disabled={isLoading}
        onClick={getRootAndStateLeader}
      >
        Fetch
      </Button>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div>Root</div>
          <div>
            {rootLeader && (
              <Code
                code={JSON.stringify(sortedRootLeader, null, 2)}
                language="json"
              />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>State</div>
          <div>
            {stateLeader && (
              <Code
                code={JSON.stringify(sortedStateLeader, null, 2)}
                language="json"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
