/* eslint-disable @next/next/no-img-element */
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

import { District, Leader, NewLeaderForm, State } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { emptyNewLeaderWithDefaultValues, LeaderForm } from '../leader-form'
import { serverSaveLeader } from '@/server-functions/new-leaders/save-leader'
import { DistrictTabContent } from './district-tab-content'
import missingPhoto from '@/public/images/no-image.jpg'
import { PhotoTabContent } from './photo-tab-content'

// TODO: This doesn't save the district yet
export function LeaderCardDialog({
  leader,
  state,
  districts,
  asChild,
  children,
}: {
  leader: Leader
  state: State
  districts?: District[]
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
      <DialogContent size="xl" className="">
        <ProfileImage leader={leader} />

        <DialogHeader>
          <DialogTitle>{leader.fullname}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="profile"
          className="h-[calc(100vh-200px)] [container-type:size]"
        >
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="district">District</TabsTrigger>
            <TabsTrigger value="other">Other Fields</TabsTrigger>
            <TabsTrigger value="photo">Photo</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100cqh-4rem)] pr-4">
            {/* Profile */}
            <TabsContent value="profile" className="mt-6">
              <LeaderForm
                leader={leader}
                state={state}
                onSubmit={handleSaveLeader}
              />
            </TabsContent>

            {/* Districts */}
            <TabsContent value="district" className="mt-6">
              {districts && (
                <DistrictTabContent leader={leader} districts={districts} />
              )}
            </TabsContent>

            {/* Photo */}
            <TabsContent value="photo" className="mt-6">
              <PhotoTabContent leader={leader} />
            </TabsContent>

            {/* Other fields */}
            <TabsContent value="other">
              <div className="my-6 flex flex-col gap-2">
                {otherFields.map((field) => (
                  <React.Fragment key={field}>
                    <DisplayField
                      leader={leader}
                      field={field as keyof Leader}
                    />
                  </React.Fragment>
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
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

function ProfileImage({ leader }: { leader: Leader }) {
  return (
    <div className="absolute right-10 top-4 z-10 m-4">
      <img
        src={
          leader.hasPhoto
            ? `/images/leader-photo/thumbnail/${leader.PhotoFile}`
            : missingPhoto.src
        }
        alt="Thumbnail"
        className="h-[148px] w-[108px] rounded-lg object-cover"
        onError={(e) => {
          e.currentTarget.onerror = null // Prevent looping if the fallback image fails to load
          e.currentTarget.src = missingPhoto.src
        }}
      />
    </div>
  )
}
