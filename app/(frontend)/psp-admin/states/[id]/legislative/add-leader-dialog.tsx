'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LeaderAiRequestForm } from '@/components/psp-admin/leader-ai-request-form'
import {
  District,
  Jurisdiction,
  Leader,
  LeaderAiQuery,
  LegislativeChamber,
  State,
  Branch,
} from '@/lib/types'
import React from 'react'
import { NewLeaderForm } from './new-leader-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LeaderSearchCard, SearchLeaderHit } from './leader-search-card'
import { serverGetStateLeader } from '@/server-functions/new-leaders/get-state-leader'
import { ExistingLeaderTabContent } from './existing-leader-tab-content'
import { serverGetDistrict } from '@/server-functions/get-district'

export function AddLeaderDialog({
  state,
  district,
  jurisdiction,
  legislativeChamber,
  branch,
  children,
}: {
  state: State
  district: District
  jurisdiction: Jurisdiction
  legislativeChamber: LegislativeChamber
  branch: Branch
  children?: React.ReactNode
}) {
  const [aiResult, setAiResult] = React.useState<LeaderAiQuery | undefined>()
  const [leaderDesignation, setLeaderDesignation] = React.useState<string>()
  const [existingLeader, setExistingLeader] = React.useState<
    Leader | undefined
  >()
  const [open, setOpen] = React.useState(false)
  const [tabsValue, setTabsValue] = React.useState<'existing' | 'new'>('new')
  const [stateLeader, setStateLeader] = React.useState<Leader | undefined>()
  const [stateLeaderDistrict, setStateLeaderDistrict] = React.useState<
    District | undefined
  >()

  React.useEffect(() => {
    if (!existingLeader) return
    const getLeader = async () => {
      const result = await serverGetStateLeader({
        leaderId: existingLeader.ref.id,
        stateCode: existingLeader.StateCode,
      })
      if (result) {
        setStateLeader(result.stateLeader)
      }
    }
    getLeader()
  }, [existingLeader])

  React.useEffect(() => {
    if (!stateLeader) {
      setStateLeaderDistrict(undefined)
      return
    }

    const getDistrict = async () => {
      if (!stateLeader.districtRef) {
        setStateLeaderDistrict(undefined)
        return
      }
      const result = await serverGetDistrict({
        districtId: stateLeader.districtRef.id,
        stateCode: stateLeader.StateCode,
      })
      if (result.success) {
        setStateLeaderDistrict(result.district)
      }
    }
    getDistrict()
  }, [stateLeader])

  const onOpenChange = (open: boolean) => {
    setAiResult(undefined)
    setLeaderDesignation(undefined)
    setOpen(open)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent size="xl" className="flex h-[calc(100vh-8rem)] flex-col">
        <DialogHeader className="">
          <DialogTitle>New Leader</DialogTitle>
          <DialogDescription>
            Add a new {state.name} leader to {district.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[calc(100vh-12rem)] [container-type:size]">
          <ScrollArea className="-mr-4 h-[calc(100cqh-1rem)]">
            <div className="ml-1 mr-8">
              <div className="grid grid-cols-2 gap-4">
                {/* First Column */}
                <div className="grid grid-rows-2 gap-6">
                  <LeaderSearchCard
                    setExistingLeader={setExistingLeader}
                    setTabsValue={setTabsValue}
                  />
                  <LeaderAiRequestForm
                    state={state}
                    setAiResult={setAiResult}
                    district={district}
                    jurisdiction={jurisdiction}
                    legislativeChamber={legislativeChamber}
                  />
                </div>
                {/* Second Column */}
                <Tabs
                  defaultValue="existing"
                  value={tabsValue}
                  onValueChange={(value) =>
                    setTabsValue(value as 'existing' | 'new')
                  }
                  className="col-span-1"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="existing">Existing</TabsTrigger>
                    <TabsTrigger value="new">New</TabsTrigger>
                  </TabsList>
                  <TabsContent value="existing">
                    <ExistingLeaderTabContent
                      existingLeader={existingLeader}
                      stateLeader={stateLeader}
                      stateLeaderDistrict={stateLeaderDistrict}
                      state={state}
                      district={district}
                      jurisdiction={jurisdiction}
                      legislativeChamber={legislativeChamber}
                      branch={branch}
                      onSuccess={() => setOpen(false)}
                    />
                  </TabsContent>
                  <TabsContent value="new">
                    <NewLeaderForm
                      state={state}
                      district={district}
                      jurisdiction={jurisdiction}
                      legislativeChamber={legislativeChamber}
                      setOpen={setOpen}
                      aiResult={aiResult}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
