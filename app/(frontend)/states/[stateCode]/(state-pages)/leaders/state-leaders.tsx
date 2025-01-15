import React from 'react'
import { TabPanel } from './tab-panel'
import { Leader } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  leaders: Leader[]
}

export function StateLeaders({ leaders }: Props) {
  return (
    <Tabs defaultValue="house">
      <TabsList className="w-full rounded-none">
        <TabsTrigger value="house">House</TabsTrigger>
        <TabsTrigger value="senate">Senate</TabsTrigger>
      </TabsList>

      <TabsContent value="house">
        <TabPanel leaders={leaders} chamber="H" />
      </TabsContent>
      <TabsContent value="senate">
        <TabPanel leaders={leaders} chamber="S" />
      </TabsContent>
    </Tabs>
  )
}
