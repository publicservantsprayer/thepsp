'use client'

import { useToast } from '@/components/hooks/use-toast'
import { LeaderForm } from '@/components/psp-admin/leader-form'
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
  NewLeaderForm,
  State,
  StateExecutiveOffice,
  StateExecutiveStructure,
} from '@/lib/types'
// TODO: should this be combined with the other saveNewStateLeader function?
import { serverSaveNewExecutiveStateLeader } from '@/server-functions/new-leaders/executive'

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

  const getOnSubmit = ({
    stateExecutiveOffice,
  }: {
    stateExecutiveOffice: StateExecutiveOffice
  }) => {
    return async function onSubmit(leaderFormData: NewLeaderForm) {
      const leader: NewLeader = {
        ...leaderFormData,
        jurisdiction,
        branch,
        stateExecutiveOffice,
        StateCode: state.ref.id,
      }

      const result = await serverSaveNewExecutiveStateLeader({
        leader,
        state,
        revalidatePath: '/states',
      })

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
              New Governor
            </h2>
            <LeaderForm state={state} leader={previous.governor} disabled />
            <LeaderForm
              state={state}
              leader={result?.governor}
              onSubmit={getOnSubmit({ stateExecutiveOffice: 'governor' })}
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
                New Lieutenant Governor
              </h2>
              <LeaderForm
                state={state}
                leader={previous.lieutenantGovernor}
                disabled
              />
              <LeaderForm
                state={state}
                leader={result?.lieutenantGovernor}
                onSubmit={getOnSubmit({
                  stateExecutiveOffice: 'lieutenant-governor',
                })}
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
                New Secretary of State
              </h2>
              <LeaderForm
                state={state}
                leader={previous.secretaryOfState}
                disabled
              />
              <LeaderForm
                state={state}
                leader={result?.secretaryOfState}
                onSubmit={getOnSubmit({
                  stateExecutiveOffice: 'secretary-of-state',
                })}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  )
}
