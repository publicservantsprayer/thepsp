'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useToast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { StateDto } from '@/lib/types'
import {
  executiveRequest,
  ExecutiveStructure,
} from '@/server-functions/ai/executive-request'
import { ScrollAreaWithHorizontal } from '@/components/ui/scroll-area'
import { Code } from '@/payload/blocks/Code/Component.client'

const FormSchema = z.object({
  query: z.string().min(4, {
    message: 'Username must be at least 4 characters.',
  }),
})

interface Props {
  state: StateDto
}

export function UpdateExecutiveBranchForm({ state }: Props) {
  const [result, setResult] = React.useState<ExecutiveStructure | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: `Please provide detailed information about the executive branch of the US State of ${state.name}, including the names of the leaders and their offices. Include only information about the Governor, Lieutenant Governor, and Secretary of State. Not all states have Lieutenant Governors or Secretaries of State, so please provide information only for the positions that exist in the state. Include important public information for each of the fields requested. Be sure to include optional fields if they are available.`,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'Asking Grok for info...',
    })
    const result = await executiveRequest(data.query, state.id)
    setResult(result)
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel>AI Request</FormLabel>
                <FormControl>
                  <Textarea className="h-48" {...field} />
                </FormControl>
                <FormDescription>The request for information.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            loading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Submit Request
          </Button>
        </form>
      </Form>
      <div className="overflow-hidden rounded border [container-type:inline-size]">
        <ScrollAreaWithHorizontal className="h-[calc(50vh)] w-[100cqw]">
          <Code code={JSON.stringify(result, null, 2)} language="json" />
        </ScrollAreaWithHorizontal>
      </div>
    </>
  )
}
