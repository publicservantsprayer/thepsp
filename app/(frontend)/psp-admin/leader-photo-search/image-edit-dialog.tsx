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

import { performGoogleImageSearch } from './perform-google-image-search'
import { Button } from '@/components/ui/button'
import { serverUploadFileFromUrl } from '@/server-functions/leader-photo/upload-photo'
import { Leader } from '@/lib/types'
import { useToast } from '@/components/hooks/use-toast'
import { useRouter } from 'next/navigation'

export function ImageEditDialog({
  item,
  isPdf,
  leader,
  children,
}: {
  item: Awaited<ReturnType<typeof performGoogleImageSearch>> extends undefined
    ? never
    : NonNullable<
        NonNullable<
          Awaited<ReturnType<typeof performGoogleImageSearch>>
        >['data']['items']
      >[number]
  leader: Leader
  isPdf: boolean
  children: React.ReactNode
}) {
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()
  const router = useRouter()

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
    } else {
      toast({ title: 'Failed to upload photo', variant: 'destructive' })
    }
    setLoading(false)
    router.push(`/psp-admin/leader-photo-edit/${leader.permaLink}`)
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
