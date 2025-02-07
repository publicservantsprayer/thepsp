'use client'

import * as React from 'react'
import { Title } from '@/components/psp-admin/title'
import { Button } from '@/components/ui/button'
import { Expand, Settings } from 'lucide-react'
import { useCookie } from '@/components/hooks/use-cookie'

interface Props {
  title: string
  buttons?: React.ReactNode
  children: React.ReactNode
  initialCookieValue?: string
}

export function ExpandableContainerClient({
  title,
  buttons,
  children,
  initialCookieValue,
}: Props) {
  const [isOpen, setIsOpen] = useCookie(
    'expandable-container-open',
    'false',
    initialCookieValue,
  )

  return (
    <div
      data-container={isOpen}
      className="mx-4 data-[container=false]:container"
    >
      <div className="flex items-center justify-between">
        <Title>{title}</Title>
        <div className="flex items-center gap-2">
          {buttons}
          <Button
            variant="ghost"
            size="xs"
            onClick={() =>
              setIsOpen((prev) => (prev === 'true' ? 'false' : 'true'))
            }
          >
            <Expand />
          </Button>
        </div>
      </div>
      {children}
    </div>
  )
}
