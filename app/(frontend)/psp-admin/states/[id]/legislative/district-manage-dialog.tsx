'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  NewLeader,
  NewLeaderForm,
  State,
} from '@/lib/types'
import React from 'react'
import { LeaderForm } from '@/components/psp-admin/leader-form'
import { LeaderAiRequestForm } from '@/components/psp-admin/leader-ai-request-form'
import { useToast } from '@/components/hooks/use-toast'
import { serverSaveNewStateLeader } from '@/server-functions/new-leaders/new-state-leader'
import { SquareX } from 'lucide-react'
import { DeleteLeaderDialog } from './delete-leader-dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

export function DistrictManageDialog({
  state,
  district,
  leaders,
  oldLeaders,
  jurisdiction,
  legislativeChamber,
  children,
}: {
  state: State
  district: District
  leaders: Leader[]
  oldLeaders: Leader[]
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
                  <TableCell className="py-2">
                    <DeleteLeaderDialog state={state} leader={leader}>
                      <SquareX size={16} />
                    </DeleteLeaderDialog>
                  </TableCell>
                  <TableCell className="py-2">{leader.fullname}</TableCell>
                  <TableCell className="py-2">{leader?.fullname}</TableCell>
                  <TableCell className="py-2"></TableCell>
                </TableRow>
              )
            })}
            {oldLeaders.map((leader, i) => {
              return (
                <TableRow key={i} className="text-muted">
                  <TableCell className="py-2">
                    <DeleteLeaderDialog state={state} leader={leader}>
                      <SquareX size={16} />
                    </DeleteLeaderDialog>
                  </TableCell>
                  <TableCell className="py-2">{leader.fullname}</TableCell>
                  <TableCell className="py-2">{leader?.fullname}</TableCell>
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
  const onOpenChange = (open: boolean) => {
    setAiResult(undefined)
    setLeaderDesignation(undefined)
    setOpen(open)
  }

  const onSubmit = async (leaderFormData: NewLeaderForm) => {
    const newLeader: NewLeader = {
      ...leaderFormData,
      jurisdiction,
      branch: 'legislative',
      legislativeChamber,
      districtRef: district.ref,
      StateCode: state.ref.id,
    }

    const result = await serverSaveNewStateLeader({
      leader: newLeader,
      state,
      revalidatePath: `/psp-admin/states/${state.ref.id.toLowerCase()}/legislative`,
    })
    if (result.success) {
      toast({
        title: 'Success',
        description: result.newLeader.fullname + ' info saved successfully.',
      })
      setOpen(false)
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
      <DialogContent
        size="default"
        className="flex h-[calc(100vh-8rem)] flex-col"
      >
        <DialogHeader className="">
          <DialogTitle>New Leader</DialogTitle>
          <DialogDescription>
            Add a new {state.name} leader to {district.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[calc(100vh-12rem)] [container-type:size]">
          <ScrollArea className="-mr-4 h-[calc(100cqh-1rem)]">
            <div className="mr-8">
              <LeaderForm
                state={state}
                setLeaderDesignation={setLeaderDesignation}
                aiResult={aiResult}
                onSubmit={onSubmit}
              />
              {leaderDesignation && (
                <LeaderAiRequestForm
                  state={state}
                  leaderDesignation={leaderDesignation}
                  setAiResult={setAiResult}
                />
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
