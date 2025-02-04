'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { LeaderAiQuery, NewLeaderForm, State } from '@/lib/types'

import { Input } from '@/components/ui/input'
import { z } from 'zod'
import React from 'react'
import Link from 'next/link'

export const emptyNewLeaderWithDefaultValues: NewLeaderForm = {
  FirstName: '',
  LastName: '',
  Title: '',
  Prefix: '',
  Gender: '',
  LegalName: '',
  MidName: '',
  NickName: '',
  BirthDate: '',
  BirthMonth: '',
  BirthYear: '',
  BirthPlace: '',
  Marital: '',
  Spouse: '',
  Family: '',
  Residence: '',
  ElectDate: '',
  Party: '',
  Religion: '',
  TwitterHandle: '',
  Facebook: '',
  Website: '',
  BallotpediaPage: '',
  WikipediaPage: '',
  Email: '',
}

type NameType = keyof NewLeaderForm
type UseFormType = UseFormReturn<NewLeaderForm>

interface LeaderFormProps {
  state: State
  leader?: NewLeaderForm
  setLeaderDesignation?: React.Dispatch<
    React.SetStateAction<string | undefined>
  >
  aiResult?: LeaderAiQuery
  disabled?: boolean
  onSubmit?: (data: NewLeaderForm) => void
}

export function LeaderForm({
  state,
  leader,
  setLeaderDesignation,
  disabled,
  aiResult,
  onSubmit,
}: LeaderFormProps) {
  if (!onSubmit) {
    onSubmit = () => {
      throw new Error('This form cannot be submitted')
    }
  }

  const validationSchema = z.object({
    FirstName: z.string().nonempty(),
    LastName: z.string().nonempty(),
    Title: z.string().nonempty(),
    Prefix: z.string().nonempty(),
    Gender: z.enum(['M', 'F']),
    LegalName: z.string().optional(),
    MidName: z.string().optional(),
    NickName: z.string().optional(),
    BirthDate: z.string().optional(),
    BirthMonth: z.string().optional(),
    BirthYear: z.string().optional(),
    BirthPlace: z.string().optional(),
    Marital: z.string().optional(),
    Spouse: z.string().optional(),
    Family: z.string().optional(),
    Residence: z.string().optional(),
    ElectDate: z.string().optional(),
    Party: z.string().optional(),
    Religion: z.string().optional(),
    TwitterHandle: z.string().optional(),
    Facebook: z.string().optional(),
    Website: z.string().optional(),
    BallotpediaPage: z.string().optional(),
    WikipediaPage: z.string().optional(),
    Email: z.string().optional(),
  })

  const form = useForm<NewLeaderForm>({
    resolver: zodResolver(validationSchema),
    defaultValues: leader || emptyNewLeaderWithDefaultValues,
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
        `${title} ${firstName} ${lastName} ` + `from the ${office}.`,
      )
    }
  }, [touchedName, firstName, lastName, setLeaderDesignation, state])

  React.useEffect(() => {
    if (aiResult) {
      form.reset(aiResult)
    }
  }, [aiResult, form])

  const formSubmitted = form.formState.isSubmitted

  // TODO: Deal with other errors
  // console.log(form.formState.errors)

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-0 pr-2"
        >
          {Object.keys(emptyNewLeaderWithDefaultValues).map((key) => {
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
                disabled={form.formState.isSubmitSuccessful}
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
