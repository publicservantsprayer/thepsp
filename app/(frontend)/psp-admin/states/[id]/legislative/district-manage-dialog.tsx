'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  District,
  Jurisdiction,
  Leader,
  LeaderAiQuery,
  LegislativeChamber,
  State,
} from '@/lib/types'
import React from 'react'
import { LeaderForm, NewLeaderForm } from '@/components/psp-admin/leader-form'
import { singleLeaderRequest } from '@/server-functions/ai/executive-request'
import { LeaderAiRequestForm } from '@/components/psp-admin/leader-ai-request-form'
import { set } from 'date-fns'
import { useToast } from '@/components/hooks/use-toast'
import { serverSaveNewStateLeader } from '@/server-functions/new-leaders/new-state-leader'

export function DistrictManageDialog({
  state,
  district,
  leaders,
  jurisdiction,
  legislativeChamber,
  children,
}: {
  state: State
  district: District
  leaders: Leader[]
  jurisdiction: Jurisdiction
  legislativeChamber: LegislativeChamber
  children?: React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>
            {state.name} - {district.name}
          </DialogTitle>
        </DialogHeader>
        <Table>
          <TableCaption></TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="py-2">Name</TableHead>
              <TableHead className="py-2"></TableHead>
              <TableHead className="py-2"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaders.map((leader, i) => {
              return (
                <TableRow key={i}>
                  <TableCell className="py-2 group-data-[dup=true]:text-yellow-500">
                    {leader.fullname}
                  </TableCell>
                  <TableCell className="py-2">{leader?.fullname}</TableCell>
                  <TableCell className="py-2"></TableCell>
                  <TableCell className="py-2"></TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className="flex justify-end">
          <AddLeaderDialog
            state={state}
            district={district}
            leaders={leaders}
            jurisdiction={jurisdiction}
            legislativeChamber={legislativeChamber}
          >
            <Button>Add New Leader</Button>
          </AddLeaderDialog>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AddLeaderDialog({
  state,
  district,
  jurisdiction,
  legislativeChamber,
  children,
}: {
  state: State
  district: District
  leaders: Leader[]
  jurisdiction: Jurisdiction
  legislativeChamber: LegislativeChamber
  children?: React.ReactNode
}) {
  const { toast } = useToast()
  const [aiResult, setAiResult] = React.useState<LeaderAiQuery | undefined>()
  const [leaderDesignation, setLeaderDesignation] = React.useState<string>()
  const [open, setOpen] = React.useState(false)
  const onOpenChange = () => {
    setAiResult(undefined)
    setLeaderDesignation(undefined)
    setOpen(!open)
  }

  async function onSubmit(leader: NewLeaderForm) {
    console.log('onsubmit leader: ', leader)
    const result = await serverSaveNewStateLeader({
      leader,
      state,
      revalidatePath: `/psp-admin/states/${state.ref.id.toLowerCase()}/legislative`,
    })
    if (result.success) {
      toast({
        title: 'Success',
        description: result.newLeader.fullname + ' info saved successfully.',
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent size="default">
        <DialogHeader>
          <DialogTitle>Add New Leader</DialogTitle>
        </DialogHeader>
        <LeaderForm
          state={state}
          district={district}
          jurisdiction={jurisdiction}
          legislativeChamber={legislativeChamber}
          branch="legislative"
          aiResult={aiResult}
          setLeaderDesignation={setLeaderDesignation}
          onSubmit={onSubmit}
        />
        {leaderDesignation && (
          <LeaderAiRequestForm
            state={state}
            leaderDesignation={leaderDesignation}
            setAiResult={setAiResult}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
