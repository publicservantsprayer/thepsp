'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useToast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Jurisdiction, LegislativeChamber, State } from '@/lib/types'
import { legislativeDistrictLeaderRequest } from '@/server-functions/ai/legislative-district-leader-request'

const FormSchema = z.object({
  query: z.string().min(4, {
    message: 'Query must be at least 4 characters.',
  }),
})

interface Props {
  state: State
  setAiResult: React.Dispatch<
    React.SetStateAction<LegislativeDistrictAiResult | undefined>
  >
  jurisdiction: Jurisdiction
  legislativeChamber: LegislativeChamber
}

export function FindLegislativeAiRequestForm({
  state,
  setAiResult,
  // jurisdiction,
  // legislativeChamber,
}: Props) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query:
        `Please extract the data from this html table, providing district, ` +
        `public official name, and their URL in a structured format.`,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'Asking AI for info...',
    })
    const result = await legislativeDistrictLeaderRequest(data.query, state)
    console.log(result)
    setAiResult(result)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">AI Request</FormLabel>
                <FormControl>
                  <Textarea className="h-64" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Find Current {} Leaders
          </Button>
        </form>
      </Form>
    </>
  )
}

export const legislativeDistrictSchema = z.object({
  // district1: z.object({
  district: z.string().describe('The name of the district.'),
  leader: z.string().describe('The name of the public official.'),
  url: z.string().describe('The URL of the public official.'),
  // }),
  // district2: z.object({
  //   district: z.string().describe('The name of the district.'),
  //   leader: z.string().describe('The name of the public official.'),
  //   url: z.string().describe('The URL of the public official.'),
  // }),
  // district3: z.object({
  //   district: z.string().describe('The name of the district.'),
  //   leader: z.string().describe('The name of the public official.'),
  //   url: z.string().describe('The URL of the public official.'),
  // }),
})

export const legislativeDistrictSchemaX = z
  .array(
    z.object({
      district: z.string().describe('The name of the district.'),
      leader: z.string().describe('The name of the public official.'),
      url: z.string().describe('The URL of the public official.'),
    }),
  )
  .describe('The list of legislative districts and their leaders.')

export type LegislativeDistrictAiResult = z.infer<
  typeof legislativeDistrictSchema
>
