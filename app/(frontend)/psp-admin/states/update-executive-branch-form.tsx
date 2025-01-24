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
import React from 'react'
import { LeaderAiQuery, State } from '@/lib/types'
import { ExecutiveStructure } from '@/server-functions/ai/executive-request'
import { Input } from '@/components/ui/input'
// import { leaderAiQuerySchema } from '@/lib/firebase/firestore/leaders.schema'
import { saveNewExecutiveStateLeader } from '@/server-functions/new-leaders/executive'
import { z } from 'zod'

export function UpdateExecutiveBranchForm({ stateDto, result }: Props) {
  // return null
  // const existingGovernor = React.use(get)

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="info">
        <AccordionTrigger>{stateDto.name} Governor</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 gap-4">
            <LeaderForm stateDto={stateDto} leader={result.governor} disabled />
            <LeaderForm stateDto={stateDto} leader={result.governor} />
          </div>
        </AccordionContent>
      </AccordionItem>

      {stateDto.hasLieutenantGovernor && (
        <AccordionItem value="leader-1">
          <AccordionTrigger>
            {stateDto.name} Lieutenant Governor
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <LeaderForm
                stateDto={stateDto}
                leader={result.governor}
                disabled
              />
              <LeaderForm
                stateDto={stateDto}
                leader={result.lieutenantGovernor}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {stateDto.hasSecretaryOfState && (
        <AccordionItem value="leader-1">
          <AccordionTrigger>
            {stateDto.name} Secretary of State
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <LeaderForm
                stateDto={stateDto}
                leader={result.governor}
                disabled
              />
              <LeaderForm
                stateDto={stateDto}
                leader={result.secretaryOfState}
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
const leaderAiQuerySchema = z.object({
  name: z.string().min(1, { message: 'Required' }),
  age: z.number().min(10),
})

const schema = z.object({
  name: z.string().min(1, { message: 'Required' }),
  age: z.number().min(10),
})
interface Props {
  stateDto: State['dto']
  result: ExecutiveStructure
}

interface LeaderFormProps {
  stateDto: State['dto']
  leader: ExecutiveStructure[
    | 'governor'
    | 'lieutenantGovernor'
    | 'secretaryOfState']
  disabled?: boolean
}

function LeaderForm({ stateDto, leader, disabled }: LeaderFormProps) {
  const { toast } = useToast()

  const form = useForm<LeaderAiQuery>({
    resolver: zodResolver(leaderAiQuerySchema),
    // resolver: zodResolver(schema),
    defaultValues: {
      ...leader,
    },
  })

  async function onSubmit(data: LeaderAiQuery) {
    toast({
      title: 'Saving new leader info...',
      // description: data.Gender,
    })
    await saveNewExecutiveStateLeader(data, stateDto.id)
  }

  if (!leader) return null

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-0"
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
                disabled={form.formState.isSubmitting}
              >
                Save Leader Info
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
          <FormLabel className="w-24 text-right text-xs">{name}</FormLabel>
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
