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
import { singleLeaderRequest } from '@/server-functions/ai/executive-request'
import { LeaderAiQuery, State } from '@/lib/types'
import { CloudCog } from 'lucide-react'

const FormSchema = z.object({
  query: z.string().min(4, {
    message: 'Query must be at least 4 characters.',
  }),
})

interface Props {
  state: State
  leaderDesignation: string
  setAiResult: React.Dispatch<React.SetStateAction<LeaderAiQuery | undefined>>
}

export function LeaderAiRequestForm({
  state,
  leaderDesignation,
  setAiResult,
}: Props) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: `Please provide detailed information about ${leaderDesignation}`,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'Asking AI for info...',
    })
    const result = await singleLeaderRequest(data.query, state)
    console.log(result)
    setAiResult(result)
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="xxspace-y-6 w-full"
        >
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">AI Request</FormLabel>
                <FormControl>
                  <Textarea className="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            size="icon"
            variant="ghost"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            <CloudCog />
          </Button>
        </form>
      </Form>
    </>
  )
}
