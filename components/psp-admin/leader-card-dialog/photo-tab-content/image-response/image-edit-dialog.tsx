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
import { useToast } from '@/components/hooks/use-toast'
import { ImageCropper } from './image-cropper'
import { useLeaderData, usePhotoRefresh } from '../../use-leader-data'
import { uploadLeaderPhotoFromUrl } from '@/lib/api/leader-photo'

interface ImageEditDialogProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any
  isPdf: boolean
  children: React.ReactNode
}

export function ImageEditDialog({
  item,
  isPdf,
  children,
}: ImageEditDialogProps) {
  const { leader, setLeader } = useLeaderData()
  const { triggerPhotoRefresh } = usePhotoRefresh()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [originalPhotoSaved, setOriginalPhotoSaved] = React.useState(false)

  if (!item) {
    return null
  }

  const handleUsePhoto = async () => {
    try {
      setLoading(true)

      // Use the client-side utility function to upload the photo from URL
      const response = await uploadLeaderPhotoFromUrl({
        url: item.link!,
        leaderPermaLink: leader.permaLink,
      })

      if (response.success) {
        // Update leader data
        setLeader({
          ...leader,
          photoUploadOriginal: response.photoUploadOriginal,
        })

        // Show success message
        toast({ title: 'Photo uploaded successfully' })

        // Update state to show cropper
        setOriginalPhotoSaved(true)

        // Trigger photo refresh
        triggerPhotoRefresh()
      } else {
        toast({
          title: 'Failed to upload photo',
          description: response.error,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
      toast({
        title: 'Error uploading photo',
        description: 'There was a problem uploading the photo.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
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
