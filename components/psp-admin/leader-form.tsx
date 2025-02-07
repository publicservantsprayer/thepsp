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
import { LeaderAiQuery, NewLeaderForm } from '@/lib/types'

import { Input } from '@/components/ui/input'
import { z } from 'zod'
import React from 'react'
import Link from 'next/link'

export const emptyNewLeaderWithDefaultValues: NewLeaderForm = {
  FirstName: '',
  LastName: '',
  MidName: '',
  Title: '',
  Prefix: '',
  Gender: '',
  BirthDate: '',
  BirthMonth: '',
  BirthYear: '',
  BirthPlace: '',
  Marital: '',
  Spouse: '',
  Family: '',
  Residence: '',
  ElectDate: '',
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
  leader?: NewLeaderForm | LeaderAiQuery
  disabled?: boolean
  onSubmit?: (data: NewLeaderForm) => void
}

export function LeaderForm({ leader, disabled, onSubmit }: LeaderFormProps) {
  if (!onSubmit) {
    onSubmit = () => {
      throw new Error('This form cannot be submitted')
    }
  }

  const validationSchema = z.object({
    FirstName: z.string().nonempty(),
    LastName: z.string().nonempty(),
    Title: z.string().nonempty(),
    Prefix: z.enum([
      'Sen.',
      'Rep.',
      'U.S. Sen.',
      'U.S. Rep.',
      'Gov.',
      'Lt. Gov.',
      'SOS.',
      'J.',
      'CJ.',
      '',
    ]),
    Gender: z.enum(['M', 'F']),
    MidName: z.string().optional(),
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

  // Add this effect to reset form when leader prop changes
  React.useEffect(() => {
    if (leader) {
      form.reset(leader)
    }
  }, [leader, form])

  // TODO: Deal with other errors
  // console.log(form.formState.errors)

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4 pr-2"
        >
          <div className="">
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
          </div>

          {!disabled && (
            <div className="">
              <Button
                type="submit"
                className="w-full"
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
