import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getLeader } from '@/lib/firebase/firestore'
import { Branch, Jurisdiction, Leader, State } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import React from 'react'
import { QueryExecutiveBranchForm } from './query-executive-branch-form'
import Link from 'next/link'
import { LeaderCardDialog } from '@/components/psp-admin/leader-card-dialog'

interface StateCardProps {
  state: State
}

export async function StateCard({ state }: StateCardProps) {
  const [governor, lieutenantGovernor, secretaryOfState] = await Promise.all([
    getLeader(state.governorRef),
    getLeader(state.lieutenantGovernorRef),
    getLeader(state.secretaryOfStateRef),
  ])

  const previous = {
    governor,
    lieutenantGovernor,
    secretaryOfState,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link
            href={`/psp-admin/states/${state.ref.id.toLowerCase()}/legislative`}
            className="hover:underline"
          >
            {state.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-lg font-semibold">Government Organization</h2>
        <div className="pl-2">
          <div className="grid grid-cols-[1fr,auto]">
            <div className="flex items-center">{state.name} Executive</div>
            <div className="flex items-center justify-end">
              <BranchUpdateDialog
                state={state}
                branch="executive"
                previous={previous}
                jurisdiction="state"
              />
            </div>
          </div>

          <div className="pl-2">
            <Governor state={state} />
            <LieutenantGovernor state={state} />
            <SecretaryOfState state={state} />
          </div>
        </div>
        <div className="pl-2">
          <div className="grid grid-cols-[1fr,auto]">
            <div className="flex items-center">{state.name} Judicial</div>
            <div className="flex items-center justify-end">
              <BranchUpdateDialog
                jurisdiction="state"
                state={state}
                branch="judicial"
                previous={previous}
              />
            </div>
          </div>

          <div className="pl-2">
            <JudicialSystem state={state} />
            <Justices state={state} />
          </div>
        </div>
        <div className="pl-2">
          <div className="grid grid-cols-[1fr,auto]">
            <div className="flex items-center">{state.name} Legislative</div>
            <div className="flex items-center justify-end">
              <Link
                href={`/psp-admin/states/${state.ref.id}/legislative`.toLowerCase()}
              >
                <Button variant="link" size="sm" className="">
                  Update
                </Button>
              </Link>
            </div>
          </div>

          <div className="pl-2">
            <LegislativeSystem state={state} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export interface PreviousStateExecutiveLeaders {
  governor: Leader | undefined
  lieutenantGovernor: Leader | undefined
  secretaryOfState: Leader | undefined
}

async function BranchUpdateDialog({
  state,
  jurisdiction,
  branch,
  previous,
}: {
  state: State
  jurisdiction: Jurisdiction
  branch: Branch
  previous: PreviousStateExecutiveLeaders
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="">
          Update
        </Button>
      </DialogTrigger>
      <DialogContent size="xl">
        <DialogHeader>
          <DialogTitle className="capitalize">
            Update {state.name} {branch} Branch
          </DialogTitle>
          <DialogDescription>
            This will submit an AI request for updated information
          </DialogDescription>
        </DialogHeader>
        <QueryExecutiveBranchForm
          state={state}
          previous={previous}
          branch={branch}
          jurisdiction={jurisdiction}
        />
      </DialogContent>
    </Dialog>
  )
}

async function Governor({ state }: StateCardProps) {
  const governor = await getLeader(state.governorRef)

  return <OfficeAndName office="Governor" leader={governor} state={state} />
}

async function LieutenantGovernor({ state }: StateCardProps) {
  if (!state.hasLieutenantGovernor)
    return (
      <OfficeAndName office="Lieutenant Governor" name={null} state={state} />
    )

  const lieutenantGovernor = await getLeader(state.lieutenantGovernorRef)

  return (
    <OfficeAndName
      office="Lieutenant Governor"
      leader={lieutenantGovernor}
      state={state}
    />
  )
}

async function SecretaryOfState({ state }: StateCardProps) {
  if (!state.hasSecretaryOfState)
    return (
      <OfficeAndName office="Secretary of State" name={null} state={state} />
    )

  const secretaryOfState = await getLeader(state.secretaryOfStateRef)

  return (
    <OfficeAndName
      office="Secretary of State"
      leader={secretaryOfState}
      state={state}
    />
  )
}

function JudicialSystem({ state }: StateCardProps) {
  return (
    <>
      <OfficeAndName
        office="Highest Appellate Court"
        name={null}
        state={state}
      />
      <OfficeAndName office="Number of Justices" name={null} state={state} />
    </>
  )
}

function Justices({ state }: StateCardProps) {
  return (
    <>
      <OfficeAndName office="Chief Justice" name={null} state={state} />
      <OfficeAndName office="Associate Justices" name={null} state={state} />
    </>
  )
}

function LegislativeSystem({ state }: StateCardProps) {
  return (
    <>
      <OfficeAndName office="Upper Chamber" name={null} state={state} />
      <OfficeAndName office="Number of Members" name="2" state={state} />
      <div className="p-1" />
      <OfficeAndName
        office="Lower Chamber"
        name="U.S. House of Representatives"
        state={state}
      />
      <OfficeAndName
        office="Number of Members"
        name={undefined}
        state={state}
      />
      <div className="p-1" />

      <OfficeAndName
        office="State Upper Chamber"
        name={undefined}
        state={state}
      />
      <OfficeAndName
        office="Number of Members"
        name={undefined}
        state={state}
      />
      <div className="p-1" />
      <OfficeAndName
        office="State Lower Chamber"
        name={undefined}
        state={state}
      />
      <OfficeAndName
        office="Number of Members"
        name={undefined}
        state={state}
      />
    </>
  )
}

function OfficeAndName({
  office,
  leader,
  name,
  state,
}: {
  office?: string
  leader?: Leader
  name?: string | null
  state: State
}) {
  return (
    <div className="grid grid-cols-2 text-sm">
      {(name || name === undefined) && (
        <div className="text-muted-foreground">{office}</div>
      )}
      {name === null && <div className="text-muted">{office}</div>}
      {leader && (
        <div className="">
          <LeaderCardDialog leader={leader} state={state}>
            {leader.fullname}
          </LeaderCardDialog>
        </div>
      )}
      {name === null && <div className="text-muted">None</div>}
      {name === undefined && !leader && (
        <div className="text-warning-foreground">Unknown</div>
      )}
    </div>
  )
}
