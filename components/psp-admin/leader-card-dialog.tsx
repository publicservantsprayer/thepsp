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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { District, Leader, NewLeaderForm, State } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { emptyNewLeaderWithDefaultValues, LeaderForm } from './leader-form'
import { serverSaveLeader } from '@/server-functions/new-leaders/save-leader'

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
  districts: District[]
  asChild?: boolean
  children?: React.ReactNode
}) {
  const initialDistrict = districts.find(
    (district) => district.ref === leader.districtRef,
  )
  const usSenateDistricts = districts.filter(
    (district) =>
      district.jurisdiction === 'federal' &&
      district.legislativeChamber === 'upper',
  )
  const usHouseDistricts = districts.filter(
    (district) =>
      district.jurisdiction === 'federal' &&
      district.legislativeChamber === 'lower',
  )
  const stateSenateDistricts = districts.filter(
    (district) =>
      district.jurisdiction === 'state' &&
      district.legislativeChamber === 'upper',
  )
  const stateHouseDistricts = districts.filter(
    (district) =>
      district.jurisdiction === 'state' &&
      district.legislativeChamber === 'lower',
  )

  const [districtPath, setDistrictPath] = React.useState<string | undefined>(
    initialDistrict?.ref.path,
  )
  const district = districts.find(
    (district) => district.ref === leader.districtRef,
  )

  const handleDistrictValueChange = (value: string) => {
    setDistrictPath(value)
  }

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
      <DialogContent size="default" className="">
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
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile" className="mt-6">
            <ScrollArea className="h-[calc(100cqh-4rem)] pr-4">
              <LeaderForm
                leader={leader}
                state={state}
                onSubmit={handleSaveLeader}
              />
            </ScrollArea>
          </TabsContent>

          {/* Districts */}
          <TabsContent value="district" className="mt-6">
            <div className="my-6">
              {district?.jurisdiction} {district?.legislativeChamber}{' '}
              {district?.name}
              {leader.districtRef?.path}
            </div>
            <div className="grid grid-cols-[auto_1fr] items-center gap-4">
              <div>U.S. Senate</div>
              <DistrictSelect
                districts={usSenateDistricts}
                districtPath={districtPath}
                setDistrictPath={handleDistrictValueChange}
              />

              <div>U.S. House</div>
              <DistrictSelect
                districts={usHouseDistricts}
                districtPath={districtPath}
                setDistrictPath={handleDistrictValueChange}
              />

              <div>State Senate</div>
              <DistrictSelect
                districts={stateSenateDistricts}
                districtPath={districtPath}
                setDistrictPath={handleDistrictValueChange}
              />

              <div>State House</div>
              <DistrictSelect
                districts={stateHouseDistricts}
                districtPath={districtPath}
                setDistrictPath={handleDistrictValueChange}
              />
            </div>
          </TabsContent>

          {/* Other fields */}
          <TabsContent value="other">
            <div className="my-6 flex flex-col gap-2">
              {otherFields.map((field) => (
                <React.Fragment key={field}>
                  <DisplayField leader={leader} field={field as keyof Leader} />
                </React.Fragment>
              ))}
            </div>
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

function DistrictSelect({
  districts,
  districtPath,
  setDistrictPath,
}: {
  districts: District[]
  districtPath: string | undefined
  setDistrictPath: (value: string) => void
}) {
  return (
    <Select value={districtPath} onValueChange={setDistrictPath}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a District" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Select a District</SelectLabel>
          {districts.map((district) => (
            <SelectItem key={district.ref.path} value={district.ref.path}>
              {district.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
