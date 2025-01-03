'use client'

import * as React from 'react'

import { useMediaQuery } from '@/hooks/use-media-query'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const modalVariants = cva('', {
  variants: {
    size: {
      sm: 'sm:max-w-[425px]',
      lg: 'sm:max-w-lg md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-7xl',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})

type ModalDrawerBaseProps = React.PropsWithChildren<{
  title: string
  button?: React.ReactNode
  description?: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}>

type ModalDrawerProps = ModalDrawerBaseProps &
  VariantProps<typeof modalVariants>

export function ModalDrawer({
  title,
  button,
  open,
  setOpen,
  description,
  size,
  children,
}: ModalDrawerProps) {
  const [localOpen, setLocalOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Dialog open={open || localOpen} onOpenChange={setOpen || setLocalOpen}>
        <DialogTrigger asChild>{button}</DialogTrigger>
        <DialogContent className={cn(modalVariants({ size }))}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {!!description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{button}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {!!description && (
            <DrawerDescription>{description}</DrawerDescription>
          )}
        </DrawerHeader>
        {children}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
