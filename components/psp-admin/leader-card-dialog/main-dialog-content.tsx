'use client'

import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LeaderForm } from '../leader-form'
import { DistrictTabContent } from './district-tab-content'
import { PhotoTabContent } from './photo-tab-content'
import { OtherFieldsTab } from './other-fields-tab'
import { useLeaderData, PhotoRefreshProvider } from './use-leader-data'
import { ProfileImage } from './profile-image'

export function MainDialogContent() {
  const { leader, state, districts, handleSaveLeader } = useLeaderData()

  return (
    <>
      <PhotoRefreshProvider>
        <DialogContent size="xl" className="">
          <ProfileImage />

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
                {state && (
                  <LeaderForm leader={leader} onSubmit={handleSaveLeader} />
                )}
              </TabsContent>

              {/* Districts */}
              <TabsContent value="district" className="mt-6">
                {districts && <DistrictTabContent />}
              </TabsContent>

              {/* Photo */}
              <TabsContent value="photo" className="mt-6">
                <PhotoTabContent />
              </TabsContent>

              {/* Other fields */}
              <TabsContent value="other">
                <OtherFieldsTab />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </PhotoRefreshProvider>
    </>
  )
}
