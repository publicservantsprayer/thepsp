'use client'

import { useToast } from '@/components/hooks/use-toast'
import { LeaderForm, NewLeaderForm } from '@/components/psp-admin/leader-form'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Branch,
  Jurisdiction,
  LeaderAiQuery,
  NewLeader,
  State,
  StateExecutiveStructure,
} from '@/lib/types'
import { saveNewExecutiveStateLeader } from '@/server-functions/new-leaders/executive'

import React from 'react'

interface Props {
  state: State
  result?: StateExecutiveStructure
  previous: {
    governor?: LeaderAiQuery
    lieutenantGovernor?: LeaderAiQuery
    secretaryOfState?: LeaderAiQuery
  }
  jurisdiction: Jurisdiction
  branch: Branch
}

export function UpdateExecutiveBranchForm({
  state,
  result,
  previous,
  branch,
  jurisdiction,
}: Props) {
  const { toast } = useToast()

  async function onSubmit(data: NewLeaderForm) {
    const result = await saveNewExecutiveStateLeader(data, state)
    if (result.success) {
      toast({
        title: 'Success',
        description: 'New leader info saved successfully.',
      })
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save leader info.',
      })
    }
  }

  return (
    <Accordion type="single" collapsible className="pr-4">
      <AccordionItem value="governor">
        <AccordionTrigger>{state.name} Governor</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <h2 className="text-center font-semibold text-muted-foreground">
              Existing Governor
            </h2>
            <h2 className="text-center font-semibold text-muted-foreground">
              AI Result
            </h2>
            {!previous.governor && <div>None</div>}
            <LeaderForm
              state={state}
              leader={previous.governor}
              branch={branch}
              jurisdiction={jurisdiction}
              onSubmit={onSubmit}
              disabled
            />
            {!result?.governor && <div>Thinking...</div>}
            <LeaderForm
              state={state}
              leader={result?.governor}
              branch={branch}
              jurisdiction={jurisdiction}
              stateExecutiveOffice="governor"
              onSubmit={onSubmit}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {state.hasLieutenantGovernor && (
        <AccordionItem value="lieutenantGovernor">
          <AccordionTrigger>{state.name} Lieutenant Governor</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <h2 className="text-center font-semibold text-muted-foreground">
                Existing Lieutenant Governor
              </h2>
              <h2 className="text-center font-semibold text-muted-foreground">
                AI Result
              </h2>
              {!previous.lieutenantGovernor && <div>None</div>}
              <LeaderForm
                state={state}
                leader={previous.lieutenantGovernor}
                branch={branch}
                jurisdiction={jurisdiction}
                disabled
                onSubmit={onSubmit}
              />
              {!result?.lieutenantGovernor && <div>Thinking...</div>}
              <LeaderForm
                state={state}
                leader={result?.lieutenantGovernor}
                branch={branch}
                jurisdiction={jurisdiction}
                stateExecutiveOffice="lieutenant-governor"
                onSubmit={onSubmit}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {state.hasSecretaryOfState && (
        <AccordionItem value="secretaryOfState">
          <AccordionTrigger>{state.name} Secretary of State</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <h2 className="text-center font-semibold text-muted-foreground">
                Existing Secretary of State
              </h2>

              <h2 className="text-center font-semibold text-muted-foreground">
                AI Result
              </h2>
              {!previous.secretaryOfState && <div>None</div>}
              <LeaderForm
                state={state}
                leader={previous.secretaryOfState}
                branch={branch}
                jurisdiction={jurisdiction}
                onSubmit={onSubmit}
                disabled
              />
              {!result?.secretaryOfState && <div>Thinking...</div>}
              <LeaderForm
                state={state}
                leader={result?.secretaryOfState}
                branch={branch}
                jurisdiction={jurisdiction}
                stateExecutiveOffice="secretary-of-state"
                onSubmit={onSubmit}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  )
}
