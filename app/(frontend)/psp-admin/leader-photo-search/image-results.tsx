import React from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { ScrollAreaWithHorizontal } from '@/components/ui/scroll-area'
import { Code } from '@/payload/blocks/Code/Component.client'
import { SearchLeaderForm } from './search-leader-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ImgType,
  performGoogleImageSearch,
} from './perform-google-image-search'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LoadMoreLink } from './load-more-link'
import { Title } from '@/components/psp-admin/title'

export async function ImageResponse({
  query,
  page,
  imgType,
}: {
  query: string
  imgType: ImgType
  page?: string
}) {
  const response = await performGoogleImageSearch(query, imgType, page)

  return (
    <div className="container">
      <Title>Leader Photo Search</Title>

      <div className="grid grid-cols-[1fr_auto] gap-6">
        <Tabs defaultValue="results" className="w-full">
          <TabsList>
            <TabsTrigger value="results">Photos</TabsTrigger>
            <TabsTrigger value="code">Search Result Data</TabsTrigger>
          </TabsList>
          <TabsContent value="results">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
              {query && <ImageResults items={response?.data.items} />}
            </div>
            <div className="flex justify-center p-4">
              <LoadMoreLink />
            </div>
          </TabsContent>

          <TabsContent value="code">
            <div className="overflow-hidden rounded border [container-type:inline-size]">
              <ScrollAreaWithHorizontal className="h-[calc(100vh-500px)] w-[100cqw]">
                <Code
                  code={JSON.stringify(response, null, 2)}
                  language="json"
                />
              </ScrollAreaWithHorizontal>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="max-w-xs">
          <CardHeader>
            <CardTitle>Search Leader Photos</CardTitle>
            <CardDescription>
              Find a photo to use for the leader.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SearchLeaderForm query={query} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ImageResults({
  items,
}: {
  items: Awaited<ReturnType<typeof performGoogleImageSearch>> extends undefined
    ? never
    : NonNullable<
        Awaited<ReturnType<typeof performGoogleImageSearch>>
      >['data']['items']
}) {
  if (!items) {
    return <div>No results</div>
  }
  return (
    <>
      {items.map((item, i) => {
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
              <Dialog>
                <DialogTrigger>
                  <img
                    src={item.image.thumbnailLink}
                    height={item.image.thumbnailHeight}
                    width={item.image.thumbnailWidth}
                    alt={item.title!}
                  />
                  {isPdf && (
                    <span className="mt-1 block text-xs">(Image in PDF)</span>
                  )}
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{item.title}</DialogTitle>
                    <DialogDescription>
                      {isPdf && <span className="text-xs">(Image in PDF)</span>}
                      {!isPdf && (
                        <img
                          src={item.link!}
                          height={item.image.height}
                          width={item.image.width}
                          alt={item.title!}
                        />
                      )}
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="flex gap-4">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        className="flex-1"
                      >
                        Close
                      </Button>
                    </DialogClose>

                    {!isPdf && (
                      <Button
                        type="button"
                        variant="default"
                        className="flex-1"
                      >
                        Use this Photo
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}
