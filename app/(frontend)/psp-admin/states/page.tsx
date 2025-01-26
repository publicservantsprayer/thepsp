import { Title } from '@/components/psp-admin/title'
import { getStates } from '@/lib/firebase/firestore'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { formatDistanceToNowStrict } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollAreaWithHorizontal } from '@/components/ui/scroll-area'
import { db } from '@/lib/firebase/server/admin-app'
import { Code } from '@/payload/blocks/Code/Component.client'
import React from 'react'
import { StateCard } from './state-card'

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
                  {formatDistanceToNowStrict(request.createdAt.toDate(), {
                    addSuffix: true,
                  })}
                </div>
                <div className="my-1 text-muted">{request.model}</div>
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
