'use client'

import * as React from 'react'
import { Title } from '@/components/psp-admin/title'
import { Button } from '@/components/ui/button'
import { Expand } from 'lucide-react'

export function ExpandableContainerTitle({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div
      data-container={isOpen}
      className="mx-4 data-[container=false]:container"
    >
      <div className="flex items-center justify-between">
        <Title>{title}</Title>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <Expand />
        </Button>
      </div>
      {children}
    </div>
  )
}
