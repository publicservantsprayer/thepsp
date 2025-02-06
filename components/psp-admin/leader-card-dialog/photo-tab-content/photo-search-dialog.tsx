'use client'

import React from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { GaxiosResponse } from 'gaxios'
import { performGoogleImageSearch } from '@/server-functions/leader-photo/perform-google-image-search'
import { ImageResponse } from './image-response'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useLeaderData } from '../use-leader-data'

const FormSchema = z.object({
  query: z.string().min(4, {
    message: 'Search query must be at least 4 characters.',
  }),
  imgType: z.enum(['face', 'photo']),
})

// Update the state type to match the returned GaxiosResponse type
export function PhotoSearchDialog() {
  const { leader } = useLeaderData()

  const [response, setResponse] = React.useState<
    GaxiosResponse<unknown> | undefined
  >(undefined)
  const [page] = React.useState<string>('1')

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: `${leader.Title} ${leader.FirstName} ${leader.LastName} ${leader.StateCode}`,
      imgType: 'face',
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const query = data.query
    const imgType = data.imgType
    const response = await performGoogleImageSearch(query, imgType, page)
    setResponse(response)
  }

  // const handleSubmitMore = () => {
  //   setPage(page + 1)
  //   // form.handleSubmit(onSubmit)
  // }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Search for New Photo</Button>
      </DialogTrigger>
      <DialogContent size="full">
        <DialogHeader>
          <DialogTitle>Search for New Photo</DialogTitle>
          <DialogDescription>
            Enter search criteria to find and update the leader&apos;s photo.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="mx-2 mb-8 mt-2 flex flex-col items-center gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-row gap-8"
              >
                <FormItem className="w-full">
                  <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input className="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormItem>
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
                {/* <Button
                  className="w-full"
                  variant="secondary"
                  onClick={handleSubmitMore}
                >
                  More
                </Button> */}
                <DialogClose asChild>
                  <Button variant="secondary" className="w-full">
                    Close
                  </Button>
                </DialogClose>
              </form>
            </Form>
          </div>
          <ImageResponse response={response} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
