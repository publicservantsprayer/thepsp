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
  Branch,
  District,
  Jurisdiction,
  LeaderAiQuery,
  LegislativeChamber,
  State,
  StateExecutiveOffice,
} from '@/lib/types'

import { Input } from '@/components/ui/input'
import { z } from 'zod'
import React from 'react'
import Link from 'next/link'

type NameType = keyof NewLeaderForm
type UseFormType = UseFormReturn<NewLeaderForm>

interface LeaderFormProps {
  state: State
  district?: District
  leader?: NewLeaderPersonalForm
  jurisdiction: Jurisdiction
  branch: Branch
  stateExecutiveOffice?: StateExecutiveOffice
  legislativeChamber?: LegislativeChamber
  aiResult?: LeaderAiQuery
  setLeaderDesignation?: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
  disabled?: boolean
  onSubmit: (data: NewLeaderForm) => void
}

export function LeaderForm({
  state,
  leader: initialLeader,
  branch,
  jurisdiction,
  stateExecutiveOffice,
  legislativeChamber,
  aiResult,
  setLeaderDesignation,
  disabled,
  onSubmit,
}: LeaderFormProps) {
  const { toast } = useToast()
  const [leader, setLeader] = React.useState<NewLeaderForm | undefined>(
    newLeaderFormSchema.parse({
      ...initialLeader,
      branch,
      jurisdiction,
      stateExecutiveOffice,
      legislativeChamber,
    }),
  )
  const [leaderSaved, setLeaderSaved] = React.useState(false)
  const validationSchema = newLeaderFormSchema.extend({
    FirstName: z.string().nonempty(),
    LastName: z.string().nonempty(),
    // LegalName: z.string().nonempty(),
  })

  const form = useForm<NewLeaderForm>({
    resolver: zodResolver(validationSchema),
    defaultValues: leader,
  })
  const [firstName, lastName] = form.watch(['FirstName', 'LastName'])
  const touchedName =
    form.formState.touchedFields.FirstName &&
    form.formState.touchedFields.LastName

  React.useEffect(() => {
    if (!setLeaderDesignation) return
    if (touchedName) {
      const office = state.upperChamberName
      const title = 'Senator'
      setLeaderDesignation(
        `Provide detailed information about ` +
          `${title} ${firstName} ${lastName} ` +
          `from the ${office}.` +
          `\n\n` +
          `Be as complete as possible.  Include information for all of the fields requested if available, including  gender, marital status, how many kids (family), city of residence, date elected, party affiliation, religion, email, Twitter or X.com handle, Facebook page, website, ballotpedia page, and wikipedia page.`,
      )
    }
  }, [touchedName, firstName, lastName, setLeaderDesignation, state])

  React.useEffect(() => {
    if (aiResult) {
      form.reset(aiResult)
    }
  }, [aiResult, form])

  React.useEffect(() => {
    if (!leader) return

    form.reset(leader)
  }, [form, leader])

  if (!leader) return null

  const formSubmitted = form.formState.isSubmitted

  console.log(form.formState.errors)
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-0 pr-2"
        >
          <input type="hidden" {...form.register('branch')} />
          <input type="hidden" {...form.register('jurisdiction')} />
          {stateExecutiveOffice && (
            <input type="hidden" {...form.register('stateExecutiveOffice')} />
          )}
          {legislativeChamber && (
            <input type="hidden" {...form.register('legislativeChamber')} />
          )}

          {Object.keys(leaderPersonalSchema.parse({})).map((key) => {
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
                {!form.formState.isSubmitSuccessful && 'Save Leader Info'}
                {form.formState.isSubmitSuccessful && 'Leader Saved'}
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

// function FieldRadio({
//   name,
//   form,
//   disabled,
// }: {
//   name: NameType
//   form: UseFormType
//   disabled?: boolean
// }) {
//   return (
//     <FormField
//       control={form.control}
//       name={name}
//       render={({ field }) => (
//         <FormItem className="space-y-3">
//           <FormLabel>{name}</FormLabel>
//           <FormControl>
//             <RadioGroup
//               onValueChange={field.onChange}
//               defaultValue={field.value}
//               className="flex flex-col space-y-1"
//             >
//               <FormItem className="flex items-center space-x-3 space-y-0">
//                 <FormControl>
//                   <RadioGroupItem value="all" />
//                 </FormControl>
//                 <FormLabel className="font-normal">All new messages</FormLabel>
//               </FormItem>
//               <FormItem className="flex items-center space-x-3 space-y-0">
//                 <FormControl>
//                   <RadioGroupItem value="mentions" />
//                 </FormControl>
//                 <FormLabel className="font-normal">
//                   Direct messages and mentions
//                 </FormLabel>
//               </FormItem>
//               <FormItem className="flex items-center space-x-3 space-y-0">
//                 <FormControl>
//                   <RadioGroupItem value="none" />
//                 </FormControl>
//                 <FormLabel className="font-normal">Nothing</FormLabel>
//               </FormItem>
//             </RadioGroup>
//           </FormControl>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   )
// }

function LinkToSocialMedia({
  children,
  name,
  form,
}: {
  children: React.ReactNode
  name: keyof NewLeaderForm
  form: UseFormType
}) {
  const value = form.getValues(name)
  if (!value || typeof value !== 'string') return <>{children}</>

  let href: string
  if (name === 'TwitterHandle') {
    const handle = value?.replace('@', '')
    href = `https://x.com/${handle}`
  } else if (
    name === 'Facebook' ||
    name === 'Website' ||
    name === 'BallotpediaPage' ||
    name === 'WikipediaPage'
  ) {
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

// Importing the schema from a leaders.schema file causes a crash
// resolver: zodResolver(leaderAiQuerySchema),
// So we define the schema in this file for now...
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
  MidName: z
    .string()
    .default('')
    .describe('The middle name of the public official'),
  NickName: z
    .string()
    .default('')
    .describe('The nickname of the public official'),
  Prefix: z.string().default('').describe('The prefix of the public official'),
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
    .describe('The official or personal website of the public official'),
  BallotpediaPage: z
    .string()
    .default('')
    .describe('The ballotpedia.com page of the public official'),
  WikipediaPage: z
    .string()
    .default('')
    .describe('The wikipedia.com page of the public official'),
  Email: z
    .string()
    .default('')
    .describe('The official email address of the public official'),
})

/**
 * Leader authority schema
 */
export const jurisdictionSchema = z.enum(['federal', 'state']) // also used in district schema
export const branchSchema = z.enum(['executive', 'legislative', 'judicial']) // also used in district schema
export const federalExecutiveOfficeSchema = z.enum([
  'president',
  'vice-president',
  'secretary-of-state',
])
export const stateExecutiveOfficeSchema = z.enum([
  'governor',
  'lieutenant-governor',
  'secretary-of-state',
])
export const legislativeChamberSchema = z.enum(['upper', 'lower'])
// Together they are the authority schema
export const leaderAuthoritySchema = z.object({
  jurisdiction: jurisdictionSchema.describe(
    'The jurisdiction (state or federal) of the public official',
  ),
  branch: branchSchema.describe(
    'The branch of government the public official serves in',
  ),
  federalExecutiveOffice: federalExecutiveOfficeSchema.optional(),
  stateExecutiveOffice: stateExecutiveOfficeSchema.optional(),
  legislativeChamber: legislativeChamberSchema.optional(),
})

const newLeaderFormSchema = z
  .object({})
  .merge(leaderPersonalSchema)
  .merge(leaderAuthoritySchema)

export type NewLeaderPersonalForm = z.infer<typeof leaderPersonalSchema>
export type NewLeaderForm = z.infer<typeof newLeaderFormSchema>
