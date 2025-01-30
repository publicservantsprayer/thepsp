'use client'

import { Leader, State } from '@/lib/types'
import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function LeaderTooltip({
  leader,
  asChild,
  children,
}: {
  leader: Leader
  state: State
  asChild?: boolean
  children?: React.ReactNode
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent>
          <DisplayField leader={leader} field="permaLink" />
          <DisplayField leader={leader} field="districtRef" />
          <DisplayField leader={leader} field="District" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
