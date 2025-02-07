'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useToast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { singleLeaderRequest as serverSingleLeaderRequest } from '@/server-functions/ai/executive-request'
import {
  District,
  Jurisdiction,
  LeaderAiQuery,
  LegislativeChamber,
  State,
} from '@/lib/types'

const FormSchema = z.object({
  query: z.string().min(4, {
    message: 'Query must be at least 4 characters.',
  }),
})

interface Props {
  state: State
  district: District
  jurisdiction: Jurisdiction
  legislativeChamber: LegislativeChamber
  setAiResult: React.Dispatch<React.SetStateAction<LeaderAiQuery | undefined>>
}

export function LeaderAiRequestForm({
  state,
  district,
  jurisdiction,
  legislativeChamber,
  setAiResult,
}: Props) {
  const { toast } = useToast()

  let legislativeBodyName = ''
  if (jurisdiction === 'federal') {
    if (legislativeChamber === 'upper') {
      legislativeBodyName = state.usSenateFullname
    } else {
      legislativeBodyName = state.usHouseFullname
    }
  } else {
    if (legislativeChamber === 'upper') {
      legislativeBodyName = state.upperChamberName ?? ''
    } else {
      legislativeBodyName = state.lowerChamberName ?? ''
    }
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: `Please get information about the ${legislativeBodyName} member representing ${district.name}.\n\n`,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'Asking AI for info...',
    })
    const result = await serverSingleLeaderRequest(data.query, state)
    console.log(result)
    setAiResult(result)
  }

  return (
    <div className="h-full [container-type:size]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full flex-col justify-between"
        >
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">AI Request</FormLabel>
                <FormControl>
                  <Textarea className="h-[calc(100cqh-6rem)]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            size="icon"
            variant="secondary"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            Ask AI
          </Button>
        </form>
      </Form>
    </div>
  )
}
