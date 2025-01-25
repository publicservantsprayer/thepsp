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
import { executiveRequest } from '@/server-functions/ai/executive-request'
import {
  ScrollArea,
  ScrollAreaWithHorizontal,
} from '@/components/ui/scroll-area'
import { Code } from '@/payload/blocks/Code/Component.client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UpdateExecutiveBranchForm } from './update-executive-branch-form'
import { DialogClose } from '@/components/ui/dialog'
import {
  Branch,
  Jurisdiction,
  State,
  StateExecutiveStructure,
} from '@/lib/types'
import { PreviousStateExecutiveLeaders } from './page'

const FormSchema = z.object({
  query: z.string().min(4, {
    message: 'Query must be at least 4 characters.',
  }),
})

interface Props {
  state: State
  jurisdiction: Jurisdiction
  branch: Branch
  previous: PreviousStateExecutiveLeaders
}

export function QueryExecutiveBranchForm({
  state,
  previous,
  branch,
  jurisdiction,
}: Props) {
  const [result, setResult] = React.useState<
    StateExecutiveStructure | undefined
  >(
    // testResult,
    undefined,
  )
  const [tab, setTab] = React.useState('query')
  const { toast } = useToast()

  let leadersToInclude = 'Governor, Lieutenant Governor, and Secretary of State'
  if (!state.hasLieutenantGovernor && state.hasSecretaryOfState) {
    leadersToInclude = 'Governor and Secretary of State'
  }
  if (state.hasLieutenantGovernor && !state.hasSecretaryOfState) {
    leadersToInclude = 'Governor and Lieutenant Governor'
  }
  if (!state.hasLieutenantGovernor && !state.hasSecretaryOfState) {
    leadersToInclude = 'Governor' // Currently no state falls into this category
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: `Please provide detailed information about the executive branch of the U.S. State of ${state.name}, including the names of the leaders and their offices. Include only information about the ${leadersToInclude}.  Include important public information for each of the fields requested. Be sure to include optional fields if they are available.  Also, give a brief description of the executive branch of the state, mentioning the names of any of these three positions (if they exist) and when they were last elected.`,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'Asking AI for info...',
    })
    const result = await executiveRequest(data.query, state)
    setResult(result)
    setTab('results')
  }

  return (
    <>
      <Tabs
        value={tab}
        onValueChange={setTab}
        defaultValue="results"
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="query">AI Query</TabsTrigger>
          <TabsTrigger value="results">Query Results</TabsTrigger>
          <TabsTrigger value="code">Data from AI</TabsTrigger>
        </TabsList>

        <TabsContent
          value="query"
          className="h-[calc(100vh-300px)] [container-type:size]"
        >
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
                      <Textarea className="h-32" {...field} />
                    </FormControl>
                    <FormDescription>
                      The request for information.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex space-x-4">
                <DialogClose asChild>
                  <Button variant="secondary" className="w-full">
                    Close
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="w-full"
                  loading={form.formState.isSubmitting}
                  disabled={form.formState.isSubmitting}
                >
                  Submit Request
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent
          value="results"
          className="-mr-5 h-[calc(100vh-300px)] [container-type:size]"
        >
          {/* {result && ( */}
          <ScrollArea className="h-[100cqh] w-[100cqw]">
            <UpdateExecutiveBranchForm
              state={state}
              result={result}
              previous={previous}
              branch={branch}
              jurisdiction={jurisdiction}
            />
          </ScrollArea>
          {/* // )} */}
        </TabsContent>

        <TabsContent
          value="code"
          className="h-[calc(100vh-300px)] outline [container-type:size]"
        >
          <ScrollAreaWithHorizontal className="h-[100cqh] w-[100cqw]">
            <Code code={JSON.stringify(result, null, 2)} language="json" />
          </ScrollAreaWithHorizontal>
        </TabsContent>
      </Tabs>
    </>
  )
}
