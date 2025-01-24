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
import {
  executiveRequest,
  ExecutiveStructure,
} from '@/server-functions/ai/executive-request'
import {
  ScrollArea,
  ScrollAreaWithHorizontal,
} from '@/components/ui/scroll-area'
import { Code } from '@/payload/blocks/Code/Component.client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UpdateExecutiveBranchForm } from './update-executive-branch-form'
import { DialogClose } from '@/components/ui/dialog'
import { State } from '@/lib/types'

const FormSchema = z.object({
  query: z.string().min(4, {
    message: 'Query must be at least 4 characters.',
  }),
})

interface Props {
  stateDto: State['dto']
}

export function QueryExecutiveBranchForm({ stateDto }: Props) {
  const [result, setResult] = React.useState<ExecutiveStructure | null>(
    testResult,
  )
  const { toast } = useToast()

  let leadersToInclude = 'Governor, Lieutenant Governor, and Secretary of State'
  if (!stateDto.hasLieutenantGovernor && stateDto.hasSecretaryOfState) {
    leadersToInclude = 'Governor and Secretary of State'
  }
  if (stateDto.hasLieutenantGovernor && !stateDto.hasSecretaryOfState) {
    leadersToInclude = 'Governor and Lieutenant Governor'
  }
  if (!stateDto.hasLieutenantGovernor && !stateDto.hasSecretaryOfState) {
    leadersToInclude = 'Governor' // Currently no state falls into this category
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: `Please provide detailed information about the executive branch of the U.S. State of ${stateDto.name}, including the names of the leaders and their offices. Include only information about the ${leadersToInclude}.  Include important public information for each of the fields requested. Be sure to include optional fields if they are available.  Also, give a brief description of the executive branch of the state, mentioning the names of any of these three positions (if they exist) and when they were last elected.`,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'Asking Grok for info...',
    })
    const result = await executiveRequest(data.query, stateDto.id)
    setResult(result)
  }

  return (
    <>
      <Tabs defaultValue="results" className="w-full">
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
          className="h-[calc(100vh-300px)] [container-type:size]"
        >
          {result && (
            <ScrollArea className="h-[100cqh] w-[100cqw]">
              <UpdateExecutiveBranchForm stateDto={stateDto} result={result} />
            </ScrollArea>
          )}
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

const testResult = {
  executiveBranchDescription:
    'The executive branch of the State of Alabama is led by the Governor, who is the chief executive officer of the state. The Governor is responsible for the execution of laws and the management of state affairs. The Lieutenant Governor, who is elected separately, serves as the President of the Senate and assumes the role of Governor in case of vacancy. The most recent election for these positions occurred in 2022.',
  governor: {
    FirstName: 'Kay',
    LastName: 'Ivey',
    LegalName: 'Kay Ellen Ivey',
    NickName: 'Kay',
    BirthDate: '15',
    BirthMonth: '10',
    BirthYear: '1944',
    BirthPlace: 'Camden, Alabama',
    Gender: 'F',
    Marital: 'Single',
    Spouse: '',
    Family: 'No children',
    Residence: 'Montgomery, Alabama',
    Title: 'Governor',
    ElectDate: '2022-11-08',
    Party: 'Republican',
    Religion: 'Baptist',
    TwitterHandle: '@GovernorKayIvey',
    Facebook: 'https://www.facebook.com/GovernorKayIvey/',
    Website: 'https://governor.alabama.gov/',
    Email: 'constituentservices@governor.alabama.gov',
    jurisdiction: 'state',
    branch: 'executive',
    stateExecutiveOffice: 'governor',
  },
  lieutenantGovernor: {
    FirstName: 'Will',
    LastName: 'Ainsworth',
    LegalName: 'William Ainsworth',
    NickName: 'Will',
    BirthDate: '22',
    BirthMonth: '03',
    BirthYear: '1981',
    BirthPlace: 'Birmingham, Alabama',
    Gender: 'M',
    Marital: 'Married',
    Spouse: 'Kendra Ainsworth',
    Family: 'Three children',
    Residence: 'Guntersville, Alabama',
    Title: 'Lieutenant Governor',
    ElectDate: '2022-11-08',
    Party: 'Republican',
    Religion: 'Christian',
    TwitterHandle: '@LtGovAinsworth',
    Facebook: 'https://www.facebook.com/LtGovAinsworth/',
    Website: 'https://ltgov.alabama.gov/',
    Email: 'ltgovernor@ltgov.alabama.gov',
    jurisdiction: 'state',
    branch: 'executive',
    stateExecutiveOffice: 'lieutenant-governor',
  },
  hasLieutenantGovernor: true,
  hasSecretaryOfState: false,
} as ExecutiveStructure
