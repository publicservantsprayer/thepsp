'use client'

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

import { Button } from '@/components/ui/button'
import { uploadFileFromUrl } from '@/server-functions/leader-photo/upload-photo'
import { Leader } from '@/lib/types'
import { useToast } from '@/components/hooks/use-toast'
import { GaxiosResponse } from 'gaxios'
import { ImageCropper } from './image-cropper'

export function ImageEditDialog({
  item,
  isPdf,
  leader: initialLeader,
  children,
}: {
  item: GaxiosResponse<unknown> extends undefined
    ? never
    : NonNullable<GaxiosResponse<unknown>>['data']['items'][number]
  leader: Leader
  isPdf: boolean
  children: React.ReactNode
}) {
  const [loading, setLoading] = React.useState(false)
  const [originalPhotoSaved, setOriginalPhotoSaved] = React.useState(false)
  const [leader, setLeader] = React.useState<Leader>(initialLeader)
  const { toast } = useToast()

  if (!item) {
    return null
  }

  const handleUsePhoto = async () => {
    setLoading(true)
    const response = await uploadFileFromUrl({
      url: item.link!,
      leaderPermaLink: leader.permaLink,
    })
    if (response.success) {
      toast({ title: 'Photo uploaded successfully' })
    } else {
      toast({ title: 'Failed to upload photo', variant: 'destructive' })
      setLeader((prev) => ({
        ...prev,
        photoUploadOriginal: response.photoUploadOriginal,
      }))
    }
    setLoading(false)
    setOriginalPhotoSaved(true)
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
          <DialogDescription>
            {isPdf && <span className="text-xs">(Image in PDF)</span>}
            {!isPdf && !originalPhotoSaved && (
              <img
                src={item.link!}
                height={item.image?.height}
                width={item.image?.width}
                alt={item.title!}
              />
            )}
          </DialogDescription>
        </DialogHeader>

        {originalPhotoSaved && <ImageCropper leader={leader} />}
        <DialogFooter className="flex gap-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="flex-1">
              Close
            </Button>
          </DialogClose>

          {!isPdf && (
            <Button
              onClick={handleUsePhoto}
              loading={loading}
              disabled={loading}
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
  )
}
