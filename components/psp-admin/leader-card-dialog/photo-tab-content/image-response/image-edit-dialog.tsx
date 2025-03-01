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
import { serverUploadFileFromUrl } from '@/server-functions/leader-photo/upload-photo'
import { useToast } from '@/components/hooks/use-toast'
import { ImageCropper } from './image-cropper'
import { useLeaderData } from '../../use-leader-data'

export function ImageEditDialog({
  item,
  isPdf,
  children,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any
  isPdf: boolean
  children: React.ReactNode
}) {
  const { leader, setLeader } = useLeaderData()
  const [loading, setLoading] = React.useState(false)
  const [originalPhotoSaved, setOriginalPhotoSaved] = React.useState(false)
  const { toast } = useToast()

  if (!item) {
    return null
  }

  const handleUsePhoto = async () => {
    setLoading(true)
    const response = await serverUploadFileFromUrl({
      url: item.link!,
      leaderPermaLink: leader.permaLink,
    })
    if (response.success) {
      toast({ title: 'Photo uploaded successfully' })
      setLeader({
        ...leader,
        photoUploadOriginal: response.photoUploadOriginal,
      })
    } else {
      toast({ title: 'Failed to upload photo', variant: 'destructive' })
    }
    setOriginalPhotoSaved(true)
    setLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
          <DialogDescription>
            {isPdf && <span className="text-xs">(Image in PDF)</span>}
          </DialogDescription>
        </DialogHeader>

        {!originalPhotoSaved && !isPdf && (
          <div className="flex flex-col items-center justify-center p-4">
            <img
              src={item.link!}
              height={item.image?.height}
              width={item.image?.width}
              alt={item.title!}
              className="max-h-[60vh] max-w-full object-contain"
            />
          </div>
        )}

        {originalPhotoSaved && <ImageCropper />}

        <DialogFooter className="flex gap-4">
          {!originalPhotoSaved && (
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="flex-1">
                Close
              </Button>
            </DialogClose>
          )}

          {!isPdf && !originalPhotoSaved && (
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
