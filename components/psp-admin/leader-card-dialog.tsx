'use client'

import { useToast } from '@/components/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Leader, NewLeaderForm, State } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { emptyNewLeaderWithDefaultValues, LeaderForm } from './leader-form'
import { serverSaveLeader } from '@/server-functions/new-leaders/save-leader'

export function LeaderCardDialog({
  leader,
  state,
  asChild,
  children,
}: {
  leader: Leader
  state: State
  asChild?: boolean
  children?: React.ReactNode
}) {
  const { toast } = useToast()

  const leaderFields = Object.keys(leader)
  const newLeaderFormField = Object.keys(emptyNewLeaderWithDefaultValues)
  const otherFields = leaderFields.filter(
    (field) => !newLeaderFormField.includes(field),
  )

  const handleSaveLeader = async (data: NewLeaderForm) => {
    const result = await serverSaveLeader({
      leader: {
        ...leader,
        ...data,
      },
    })

    if (result.success) {
      toast({
        title: 'Leader saved.',
      })
    } else {
      toast({
        title: 'Error',
        description: result.error,
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>{leader.fullname}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="form" className="">
          <TabsList>
            <TabsTrigger value="form">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <DisplayField leader={leader} field="jurisdiction" />
                  <DisplayField leader={leader} field="branch" />
                  <DisplayField leader={leader} field="legislativeChamber" />
                  <DisplayField leader={leader} field="districtName" />
                </div>
                <div className="flex flex-col gap-1">
                  <DisplayField leader={leader} field="LegType" />
                  <DisplayField leader={leader} field="Chamber" />
                  <DisplayField leader={leader} field="District" />
                  <DisplayField leader={leader} field="DistrictID" />
                </div>
              </div>
              <LeaderForm
                leader={leader}
                state={state}
                onSubmit={handleSaveLeader}
              />
              <div className="flex flex-row flex-wrap gap-1">
                {otherFields.map((field) => (
                  <React.Fragment key={field}>
                    <DisplayField
                      leader={leader}
                      field={field as keyof Leader}
                    />
                  </React.Fragment>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function DisplayField({
  leader,
  field,
}: {
  leader: Leader
  field: keyof Leader
}) {
  return (
    <div className="flex w-fit flex-row gap-1 rounded border bg-muted/20 p-1">
      <div className="text-xs font-semibold text-muted-foreground">{field}</div>
      <div className="text-xs">{`${leader[field]}`}</div>
    </div>
  )
}
