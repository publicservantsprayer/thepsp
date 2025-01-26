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
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const FormSchema = z.object({
  query: z.string().min(4, {
    message: 'Username must be at least 4 characters.',
  }),
  imgType: z.enum(['face', 'photo']),
})

export function SearchLeaderForm({ query }: { query: string }) {
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: query || '',
      imgType: 'face',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const urlSearchParams = new URLSearchParams(data)
    router.push('/psp-admin/leader-photo-search?' + urlSearchParams.toString())
    toast({
      title: 'Searching Google for Image:',
      // description: JSON.stringify(data),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leader Name and Office</FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} />
              </FormControl>
              <FormDescription>
                The name and office the leader holds.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormControl>
            <FormField
              control={form.control}
              name="imgType"
              render={({ field }) => (
                <ToggleGroup
                  type="single"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <ToggleGroupItem value="face">Face</ToggleGroupItem>
                  <ToggleGroupItem value="photo">Photo</ToggleGroupItem>
                </ToggleGroup>
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <Button type="submit" className="w-full">
          Search
        </Button>
      </form>
    </Form>
  )
}
