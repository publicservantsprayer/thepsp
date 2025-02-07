/* eslint-disable @next/next/no-img-element */
'use client'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { District, Leader, State } from '@/lib/types'
import React from 'react'
import { LeaderDataProvider } from './use-leader-data'
import { MainDialogContent } from './main-dialog-content'

export function LeaderCardDialog({
  leader: initialLeader,
  state: initialState,
  districts,
  asChild,
  children,
}: {
  leader: Leader
  state?: State
  districts?: District[]
  asChild?: boolean
  children?: React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <LeaderDataProvider
        initialLeader={initialLeader}
        initialState={initialState}
        initialDistricts={districts}
      >
        <MainDialogContent />
      </LeaderDataProvider>
    </Dialog>
  )
}
