'use client'

import { useToast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Leader, State } from '@/lib/types'
import {
  serverDeleteStateAndRootLeader,
  serverDeleteStateLeader,
} from '@/server-functions/new-leaders/delete'
import { CheckedState } from '@radix-ui/react-checkbox'
import React, { MouseEventHandler } from 'react'

export function DeleteLeaderDialog({
  state,
  leader,
  children,
}: {
  state: State
  leader: Leader
  children?: React.ReactNode
}) {
  const { toast } = useToast()
  const [deleteRoot, setDeleteRoot] = React.useState(false)
  const [areYouSure, setAreYouSure] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const handleOnOpenChange = (open: boolean) => {
    setDeleteRoot(false)
    setAreYouSure(false)
    setOpen(open)
  }

  const handleDelete: MouseEventHandler<HTMLButtonElement> = async () => {
    if (deleteRoot && areYouSure) {
      const result = await serverDeleteStateAndRootLeader({
        state,
        leader,
        revalidatePath: '/psp-admin/states/' + state.ref.id.toLowerCase(),
      })
      if (result.success) {
        toast({
          title: leader.fullname + ' deleted.',
        })
        setOpen(false)
      }
    } else {
      const result = await serverDeleteStateLeader({
        state,
        leader,
        revalidatePath: '/psp-admin/states/' + state.ref.id.toLowerCase(),
      })
      if (result.success) {
        toast({
          title: leader.fullname + ' removed.',
        })
        setOpen(false)
      }
    }
  }

  const onCheckedChange = async (checked: CheckedState) => {
    if (checked === 'indeterminate') {
      console.log(checked)
    } else {
      setDeleteRoot(checked)
    }
  }

  const buttonEnabled = !deleteRoot || (deleteRoot && areYouSure)
  const buttonText = deleteRoot ? 'Delete Leader' : 'Remove Leader'

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent size="default">
        <DialogHeader>
          <DialogTitle>
            Remove {leader.fullname} from {state.name}?
          </DialogTitle>
          <DialogDescription className="sr-only">
            Are you sure you want to remove {leader.fullname} from {state.name}?
          </DialogDescription>
        </DialogHeader>

        <Button onClick={handleDelete} disabled={!buttonEnabled}>
          {buttonText}
        </Button>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="delete-root"
            checked={deleteRoot}
            onCheckedChange={onCheckedChange}
          />
          <label
            htmlFor="delete-root"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Also completely delete this leader from the database.
          </label>
        </div>
        {deleteRoot && (
          <>
            <div className="text-destructive">
              Are you sure? Normally we leave leaders in the database for
              historical purposes.
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="are-you-sure"
                checked={areYouSure}
                onCheckedChange={(checked) => setAreYouSure(!!checked)}
              />
              <label
                htmlFor="are-you-sure"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {"Yes, I'm sure."}
              </label>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
