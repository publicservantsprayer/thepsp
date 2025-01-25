'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, UseFormReturn } from 'react-hook-form'

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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Branch,
  Jurisdiction,
  Leader,
  LeaderAiQuery,
  State,
  StateExecutiveOffice,
  StateExecutiveStructure,
} from '@/lib/types'

import { Input } from '@/components/ui/input'
// import { leaderAiQuerySchema } from '@/lib/firebase/firestore/leaders.schema'
import { saveNewExecutiveStateLeader } from '@/server-functions/new-leaders/executive'
import { z } from 'zod'
import React from 'react'
import Link from 'next/link'

interface Props {
  state: State
  result?: StateExecutiveStructure
  previous: {
    governor?: LeaderAiQuery
    lieutenantGovernor?: LeaderAiQuery
    secretaryOfState?: LeaderAiQuery
  }
  jurisdiction: Jurisdiction
  branch: Branch
}

export function UpdateExecutiveBranchForm({
  state,
  result,
  previous,
  branch,
  jurisdiction,
}: Props) {
  return (
    <Accordion type="single" collapsible className="pr-4">
      <AccordionItem value="governor">
        <AccordionTrigger>{state.name} Governor</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <h2 className="text-center font-semibold text-muted-foreground">
              Existing Governor
            </h2>
            <h2 className="text-center font-semibold text-muted-foreground">
              AI Result
            </h2>
            {!previous.governor && <div>None</div>}
            <LeaderForm
              state={state}
              leader={previous.governor}
              branch={branch}
              jurisdiction={jurisdiction}
              disabled
            />
            {!result?.governor && <div>Thinking...</div>}
            <LeaderForm
              state={state}
              leader={result?.governor}
              branch={branch}
              jurisdiction={jurisdiction}
              stateExecutiveOffice="governor"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {state.hasLieutenantGovernor && (
        <AccordionItem value="lieutenantGovernor">
          <AccordionTrigger>{state.name} Lieutenant Governor</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <h2 className="text-center font-semibold text-muted-foreground">
                Existing Lieutenant Governor
              </h2>
              <h2 className="text-center font-semibold text-muted-foreground">
                AI Result
              </h2>
              {!previous.lieutenantGovernor && <div>None</div>}
              <LeaderForm
                state={state}
                leader={previous.lieutenantGovernor}
                branch={branch}
                jurisdiction={jurisdiction}
                disabled
              />
              {!result?.lieutenantGovernor && <div>Thinking...</div>}
              <LeaderForm
                state={state}
                leader={result?.lieutenantGovernor}
                branch={branch}
                jurisdiction={jurisdiction}
                stateExecutiveOffice="lieutenant-governor"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {state.hasSecretaryOfState && (
        <AccordionItem value="secretaryOfState">
          <AccordionTrigger>{state.name} Secretary of State</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <h2 className="text-center font-semibold text-muted-foreground">
                Existing Secretary of State
              </h2>

              <h2 className="text-center font-semibold text-muted-foreground">
                AI Result
              </h2>
              {!previous.secretaryOfState && <div>None</div>}
              <LeaderForm
                state={state}
                leader={previous.secretaryOfState}
                branch={branch}
                jurisdiction={jurisdiction}
                disabled
              />
              {!result?.secretaryOfState && <div>Thinking...</div>}
              <LeaderForm
                state={state}
                leader={result?.secretaryOfState}
                branch={branch}
                jurisdiction={jurisdiction}
                stateExecutiveOffice="secretary-of-state"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  )
}

type NameType = keyof LeaderAiQuery
type UseFormType = UseFormReturn<LeaderAiQuery>

interface LeaderFormProps {
  state: State
  leader?: LeaderAiQuery
  jurisdiction: Jurisdiction
  branch: Branch
  stateExecutiveOffice?: StateExecutiveOffice
  disabled?: boolean
}

function LeaderForm({
  state,
  leader,
  branch,
  jurisdiction,
  stateExecutiveOffice,
  disabled,
}: LeaderFormProps) {
  const { toast } = useToast()
  const [leaderSaved, setLeaderSaved] = React.useState(false)

  const form = useForm<LeaderAiQuery>({
    // Importing the schema from a leaders.schema file causes a crash
    // resolver: zodResolver(leaderAiQuerySchema),
    // So we define the schema in this file for now...
    resolver: zodResolver(localLeaderAiQuerySchema),
    defaultValues: leader,
  })

  React.useEffect(() => {
    if (!leader) return

    form.reset(leader)
  }, [form, leader])

  async function onSubmit(data: LeaderAiQuery) {
    const result = await saveNewExecutiveStateLeader(
      {
        ...data,
        branch,
        jurisdiction,
        stateExecutiveOffice,
        stateCode: state.ref.id,
        lastImportDate: new Date(),
        hasPhoto: false,
      },
      state,
    )
    if (result.success) {
      setLeaderSaved(true)
      toast({
        title: 'Success',
        description: 'New leader info saved successfully.',
      })
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save leader info.',
      })
    }
  }

  if (!leader) return null

  const formSubmitted = form.formState.isSubmitted

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-0 pr-2"
        >
          {Object.keys(leader).map((key) => {
            const name = key as NameType
            return (
              <FieldInput
                key={key}
                name={name}
                form={form}
                disabled={disabled}
              />
            )
          })}
          {!disabled && (
            <div className="flex justify-end py-4">
              <Button
                type="submit"
                className=""
                loading={form.formState.isSubmitting}
                disabled={formSubmitted}
              >
                {!leaderSaved && 'Save Leader Info'}
                {leaderSaved && 'Leader Saved'}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </>
  )
}

type FormFieldProps = {
  name: NameType
  form: UseFormType
  disabled?: boolean
}
function FieldInput({ name, form, disabled }: FormFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="grid grid-cols-[auto,1fr] items-baseline gap-2">
          <FormLabel className="w-24 text-right text-xs text-muted-foreground">
            <LinkToSocialMedia name={name} form={form}>
              {name}
            </LinkToSocialMedia>
          </FormLabel>
          <div className="flex flex-col">
            <FormControl>
              <Input
                className="h-6 rounded-sm md:text-xs"
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage className="mt-1 text-xs" />
          </div>
        </FormItem>
      )}
    />
  )
}

function LinkToSocialMedia({
  children,
  name,
  form,
}: {
  children: React.ReactNode
  name: keyof LeaderAiQuery
  form: UseFormType
}) {
  const value = form.getValues(name)
  let href: string
  if (name === 'TwitterHandle') {
    const handle = value?.replace('@', '')
    href = `https://x.com/${handle}`
  } else if (name === 'Facebook' || name === 'Website') {
    href = value
  } else {
    return <>{children}</>
  }

  return (
    <Link
      href={href}
      target="_blank"
      className="hover:text-foreground hover:underline"
    >
      {children}
    </Link>
  )
}

// !!!!!!!!!!!!!!!!!!!!!!
// These are copied verbatim from the leader schema file
// if imported, everything blows up.
// !!!!!!!!!!!!!!!!!!!!!!

// These need default values for controlled form fields
const leaderPersonalSchema = z.object({
  // Personal Information
  FirstName: z
    .string()
    .default('')
    .describe('The first name of the public official'),
  LastName: z
    .string()
    .default('')
    .describe('The last name of the public official'),
  LegalName: z
    .string()
    .default('')
    .describe('The full legal name of the public official'),
  NickName: z
    .string()
    .default('')
    .describe('The nickname of the public official'),
  BirthDate: z
    .string()
    .default('')
    .describe('The numeric birth day of the month of the public official'),
  BirthMonth: z
    .string()
    .default('')
    .describe('The numeric birth month of the year of the public official'),
  BirthYear: z
    .string()
    .default('')
    .describe('The numeric birth year of the public official'),
  BirthPlace: z
    .string()
    .default('')
    .describe('The city and state of the birthplace of the public official'),
  Gender: z
    .enum(['', 'M', 'F'])
    .default('')
    .describe('The biological sex of the public official'),
  // Family and Residence
  Marital: z
    .string()
    .default('')
    .describe('The marital status of the public official'),
  Spouse: z
    .string()
    .default('')
    .describe('The name of the spouse of the public official'),
  Family: z
    .string()
    .default('')
    .describe('How many children the public official has, if any'),
  Residence: z
    .string()
    .default('')
    .describe('The city and state of the residence of the public official'),
  // Office and Beliefs
  Title: z.string().default('').describe('The title of the public official'),
  ElectDate: z
    .string()
    .default('')
    .describe('The date the public official was elected'),
  Party: z
    .string()
    .default('')
    .describe('The political party of the public official'),
  Religion: z
    .string()
    .default('')
    .describe('The religious affiliation of the public official'),
  // Social Media and Contact
  TwitterHandle: z
    .string()
    .default('')
    .describe(
      'The official X (Twitter) platform handle of the public official',
    ),
  Facebook: z
    .string()
    .default('')
    .describe('The official Facebook page (URL) of the public official'),
  Website: z
    .string()
    .default('')
    .describe('The official website of the public official'),
  Email: z
    .string()
    .default('')
    .describe('The official email address of the public official'),
})

const localLeaderAiQuerySchema = z
  .object({})
  .merge(leaderPersonalSchema)
  .default({})
