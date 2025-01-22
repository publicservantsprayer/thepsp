import { Title } from '@/components/psp-admin/title'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getStates, LeaderConverter } from '@/lib/firebase/firestore'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { State } from '@/lib/types'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollAreaWithHorizontal } from '@/components/ui/scroll-area'
import { Code } from '@/payload/blocks/Code/Component.client'
import { Button } from '@/components/ui/button'
import { UpdateExecutiveBranchForm } from './update-executive-branch-form'

export default async function PspAdminStatesPage() {
  await mustGetCurrentAdmin()
  const states = await getStates()

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
              <StateCard key={state.id} state={state} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="code">
          <div className="overflow-hidden rounded border [container-type:inline-size]">
            <ScrollAreaWithHorizontal className="h-[calc(100vh-500px)] w-[100cqw]">
              {/* <Code code={JSON.stringify(response, null, 2)} language="json" /> */}
            </ScrollAreaWithHorizontal>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface StateCardProps {
  state: State
}

function StateCard({ state }: StateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{state.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <h2>Government Organization</h2>
        <div className="">
          <BranchUpdateDialog state={state} branch="executive" />
          <div className="pl-2">
            <Governor state={state} />
            <LieutenantGovernor state={state} />
            <SecretaryOfState state={state} />
          </div>
        </div>
        <h3>Legislative Branch</h3>
        <h3>Judicial Branch</h3>
      </CardContent>
    </Card>
  )
}

function BranchUpdateDialog({
  state,
  branch,
}: {
  state: State
  branch: 'executive' | 'legislative' | 'judicial'
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="capitalize">
          {state.name} {branch} Branch
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">
            Update {state.name} {branch} Branch
          </DialogTitle>
          <DialogDescription>
            This will submit an AI request for updated information
          </DialogDescription>
        </DialogHeader>
        <UpdateExecutiveBranchForm state={state.dto} />
      </DialogContent>
    </Dialog>
  )
}

async function Governor({ state }: StateCardProps) {
  const governorSnapshot = state.governorRef
    ? await state.governorRef.withConverter(LeaderConverter).get()
    : null
  const governor = governorSnapshot?.data()

  return (
    <div>
      <span className="">Governor: </span>
      <span>{governor && governor.LastName}</span>
    </div>
  )
}

async function LieutenantGovernor({ state }: StateCardProps) {
  if (!state.hasLieutenantGovernor) return null

  const lieutenantSnapshot = state.lieutenantGovernorRef
    ? await state.lieutenantGovernorRef.withConverter(LeaderConverter).get()
    : null
  const lieutenantGovernor = lieutenantSnapshot?.data()

  return (
    <div>
      <span className="">Lieutenant Governor: </span>
      <span>{lieutenantGovernor && lieutenantGovernor.LastName}</span>
    </div>
  )
}

async function SecretaryOfState({ state }: StateCardProps) {
  if (!state.hasSecretaryOfState) return null

  const secretaryOfStateSnapshot = state.secretaryOfStateRef
    ? await state.secretaryOfStateRef.withConverter(LeaderConverter).get()
    : null
  const secretaryOfState = secretaryOfStateSnapshot?.data()

  return (
    <div>
      <span className="">Lieutenant Governor: </span>
      <span>{secretaryOfState && secretaryOfState.LastName}</span>
    </div>
  )
}
