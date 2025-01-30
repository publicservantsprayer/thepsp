'use client'

import { useToast } from '@/components/hooks/use-toast'
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import {
  District,
  Jurisdiction,
  Leader,
  LegislativeChamber,
  State,
} from '@/lib/types'
import { addNewDistrict, serverDeleteDistrict } from '@/server-functions/states'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Scroll, SquareX } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ScrollArea } from '@/components/ui/scroll-area'
import { serverSaveLinedUpLeaders } from '@/server-functions/new-leaders/save-leader-batch'
import { emptyNewLeaderWithDefaultValues, LeaderForm } from './leader-form'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { LeaderCardDialog } from './leader-card-dialog'

export function LeaderTooltip({
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
