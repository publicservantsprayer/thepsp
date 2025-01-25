import { Title } from '@/components/psp-admin/title'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getStates, getLeader } from '@/lib/firebase/firestore'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { Branch, Jurisdiction, LeaderAiQuery, State } from '@/lib/types'
import { formatDistanceToNowStrict } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollAreaWithHorizontal } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { QueryExecutiveBranchForm } from './query-executive-branch-form'
import { db } from '@/lib/firebase/server/admin-app'
import { Code } from '@/payload/blocks/Code/Component.client'
import React from 'react'
import { leaderAiQuerySchema } from '@/lib/firebase/firestore/leaders.schema'

export default async function PspAdminStatesPage() {
  await mustGetCurrentAdmin()
  const states = await getStates()
  const aiRequestsSnapshot = await db.collection('aiRequests').get()
  const aiRequests = aiRequestsSnapshot.docs.map((doc) => doc.data())

  return (
    <div className="container">
      <Title>The 50 States of the Union</Title>

      <Tabs defaultValue="states" className="w-full">
        <TabsList>
          <TabsTrigger value="states">State Governmental Structure</TabsTrigger>
          <TabsTrigger value="code">AI Data Collection Log</TabsTrigger>
        </TabsList>

        <TabsContent value="states">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(24rem,1fr))] gap-4">
            {states.map((state) => (
              <StateCard key={state.ref.id} state={state} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="code" className="grid grid-cols-[33vw,1fr] gap-8">
          {aiRequests.map((request, i) => (
            <React.Fragment key={i}>
              <div className="">
                <div className="my-1 text-muted">
                  {' '}
                  Date:{' '}
                  {formatDistanceToNowStrict(request.createdAt.toDate(), {
                    addSuffix: true,
                  })}
                </div>
                <div className="my-1 text-muted">Model: {request.model}</div>
                <h2 className="my-1 text-muted">Query:</h2>
                <div className="ps-8">{request.query}</div>
              </div>
              <div className="overflow-hidden rounded border [container-type:inline-size]">
                <ScrollAreaWithHorizontal className="h-[500px] w-[100cqw]">
                  <Code
                    code={JSON.stringify(request.response, null, 2)}
                    language="json"
                  />
                </ScrollAreaWithHorizontal>
              </div>
            </React.Fragment>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface StateCardProps {
  state: State
}

async function StateCard({ state }: StateCardProps) {
  const [governor, lieutenantGovernor, secretaryOfState] = await Promise.all([
    getLeader(state.governorRef),
    getLeader(state.lieutenantGovernorRef),
    getLeader(state.secretaryOfStateRef),
  ])

  const previous = {
    governor: leaderAiQuerySchema.parse(governor),
    lieutenantGovernor: leaderAiQuerySchema.parse(lieutenantGovernor),
    secretaryOfState: leaderAiQuerySchema.parse(secretaryOfState),
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{state.name}</CardTitle>
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
              <BranchUpdateDialog
                state={state}
                jurisdiction="state"
                branch="legislative"
                previous={previous}
              />
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
  governor: LeaderAiQuery
  lieutenantGovernor: LeaderAiQuery
  secretaryOfState: LeaderAiQuery
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
  const governor = state.governorRef ? await getLeader(state.governorRef) : null

  return <OfficeAndName office="Governor" name={governor?.fullname} />
}

async function LieutenantGovernor({ state }: StateCardProps) {
  if (!state.hasLieutenantGovernor)
    return <OfficeAndName office="Lieutenant Governor" name={null} />

  const lieutenantGovernor = state.lieutenantGovernorRef
    ? await getLeader(state.lieutenantGovernorRef)
    : null

  return (
    <OfficeAndName
      office="Lieutenant Governor"
      name={lieutenantGovernor?.fullname}
    />
  )
}

async function SecretaryOfState({ state }: StateCardProps) {
  if (!state.hasSecretaryOfState)
    return <OfficeAndName office="Secretary of State" name={null} />

  const secretaryOfState = state.secretaryOfStateRef
    ? await getLeader(state.secretaryOfStateRef)
    : null

  return (
    <OfficeAndName
      office="Secretary of State"
      name={secretaryOfState?.fullname}
    />
  )
}

function JudicialSystem({ state }: StateCardProps) {
  return (
    <>
      <OfficeAndName office="Highest Appellate Court" name={undefined} />
      <OfficeAndName office="Number of Justices" name={undefined} />
    </>
  )
}

function Justices({ state }: StateCardProps) {
  return (
    <>
      <OfficeAndName office="Chief Justice" name={undefined} />
      <OfficeAndName office="Associate Justices" name={undefined} />
    </>
  )
}

function LegislativeSystem({ state }: StateCardProps) {
  return (
    <>
      <OfficeAndName office="Upper Chamber" name="U.S. Senate" />
      <OfficeAndName office="Number of Members" name="2" />
      <div className="p-1" />
      <OfficeAndName
        office="Lower Chamber"
        name="U.S. House of Representatives"
      />
      <OfficeAndName office="Number of Members" name={undefined} />
      <div className="p-1" />

      <OfficeAndName office="State Upper Chamber" name={undefined} />
      <OfficeAndName office="Number of Members" name={undefined} />
      <div className="p-1" />
      <OfficeAndName office="State Lower Chamber" name={undefined} />
      <OfficeAndName office="Number of Members" name={undefined} />
    </>
  )
}

function OfficeAndName({
  office,
  name,
}: {
  office?: string
  name?: string | null
}) {
  return (
    <div className="grid grid-cols-2 text-sm">
      {(name || name === undefined) && (
        <div className="text-muted-foreground">{office}</div>
      )}
      {name === null && <div className="text-muted">{office}</div>}
      {name && <div className="">{name}</div>}
      {name === null && <div className="text-muted">None</div>}
      {name === undefined && (
        <div className="text-warning-foreground">Unknown</div>
      )}
    </div>
  )
}
