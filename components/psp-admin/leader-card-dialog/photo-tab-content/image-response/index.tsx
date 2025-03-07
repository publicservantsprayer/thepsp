/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { ScrollAreaWithHorizontal } from '@/components/ui/scroll-area'
import { Code } from '@/payload/blocks/Code/Component.client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { ImageEditDialog } from './image-edit-dialog'
import { useLeaderData } from '../../use-leader-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ImageResponse({ response }: { response?: any }) {
  if (!response) {
    return null
  }

  return (
    <div className="grid grid-cols-[1fr_auto] gap-6">
      <Tabs defaultValue="results" className="w-full">
        <TabsList>
          <TabsTrigger value="results">Photos</TabsTrigger>
          <TabsTrigger value="code">Search Result Data</TabsTrigger>
        </TabsList>
        <TabsContent value="results">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
            <ImageResults items={response?.data?.items} />
          </div>
          <div className="flex justify-center p-4">
            {/* <LoadMoreLink /> */}
          </div>
        </TabsContent>

        <TabsContent value="code">
          <div className="overflow-hidden rounded border [container-type:inline-size]">
            <ScrollAreaWithHorizontal className="h-[calc(100vh-500px)] w-[100cqw]">
              <Code code={JSON.stringify(response, null, 2)} language="json" />
            </ScrollAreaWithHorizontal>
          </div>
        </TabsContent>
      </Tabs>

      {/* <Card className="max-w-xs">
          <CardHeader>
            <CardTitle>Search Leader Photos</CardTitle>
            <CardDescription>
              Find a photo to use for the leader.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SearchLeaderForm query={query} />
          </CardContent>
        </Card> */}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ImageResults({ items }: { items?: any }) {
  const { leader } = useLeaderData()

  if (!items) {
    return <div>No results</div>
  }
  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {items.map((item: any, i: number) => {
        if (!item.image?.contextLink) {
          return null
        }
        const extension = item.image.contextLink.split('.').pop()?.toLowerCase()
        const isPdf = extension === 'pdf'
        return (
          <Card key={i} className="bg-card/40">
            <CardHeader>
              <CardTitle className="my-2 text-sm">{item.title}</CardTitle>
              <CardDescription>
                <Link
                  href={item.image.contextLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs hover:underline"
                >
                  {item.displayLink}
                </Link>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ImageEditDialog item={item} isPdf={isPdf}>
                <img
                  src={item.image.thumbnailLink}
                  height={item.image.thumbnailHeight}
                  width={item.image.thumbnailWidth}
                  alt={item.title!}
                />
                {isPdf && (
                  <span className="mt-1 block text-xs">(Image in PDF)</span>
                )}
              </ImageEditDialog>
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}
