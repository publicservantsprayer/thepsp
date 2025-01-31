/* eslint-disable @next/next/no-img-element */
import React from 'react'

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

import { performGoogleImageSearch } from './perform-google-image-search'
import { Button } from '@/components/ui/button'
import { uploadFileFromUrl } from '@/server-functions/leader-photo/upload-photo'

export function ImageEditDialog({
  item,
  isPdf,
  children,
}: {
  item: Awaited<ReturnType<typeof performGoogleImageSearch>> extends undefined
    ? never
    : NonNullable<
        NonNullable<
          Awaited<ReturnType<typeof performGoogleImageSearch>>
        >['data']['items']
      >[number]
  isPdf: boolean
  children: React.ReactNode
}) {
  if (!item) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
          <DialogDescription>
            {isPdf && <span className="text-xs">(Image in PDF)</span>}
            {!isPdf && (
              <img
                src={item.link!}
                height={item.image?.height}
                width={item.image?.width}
                alt={item.title!}
              />
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="flex-1">
              Close
            </Button>
          </DialogClose>

          {!isPdf && (
            <Button type="button" variant="default" className="flex-1">
              Use this Photo
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
