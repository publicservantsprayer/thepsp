'use client'

import React from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { State } from '@/lib/types'

export function VerifyRootLeaders({
  states,
  verifyRootLeadersForState,
}: {
  states: State[]
  verifyRootLeadersForState: (state: State) => Promise<string>
}) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [messages, setMessages] = React.useState<string[]>([])

  const handleVerifyRootLeaders = async () => {
    setIsLoading(true)
    for (const state of states) {
      const result = await verifyRootLeadersForState(state)
      setMessages((prev) => [...prev, result])
    }
    setIsLoading(false)
  }

  return (
    <div className="grid grid-cols-[1fr_auto] gap-4">
      <div className="flex flex-col gap-2 rounded-md border border-border p-4">
        {messages.map((message) => (
          <div key={message}>{message}</div>
        ))}
      </div>
      <Card className="max-w-xs">
        <CardHeader>
          <CardTitle>Verify Root Leaders</CardTitle>
          <CardDescription>
            Verify that the root leader for each state leader exists in the root
            leaders collection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            loading={isLoading}
            onClick={handleVerifyRootLeaders}
            disabled={isLoading}
          >
            Verify Root Leaders
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
