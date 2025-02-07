'use client'

import { useToast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Leader } from '@/lib/types'
import { serverGetRootLeader } from '@/server-functions/new-leaders/get-root-leader'
import { Search as SearchIcon } from 'lucide-react'
import React from 'react'
import { useHits, useInstantSearch, useSearchBox } from 'react-instantsearch'

export type SearchLeaderHit = Omit<Leader, 'ref'> & {
  objectID: string
}

interface LeaderSearchCardProps {
  setExistingLeader: (leader: Leader) => void
  setTabsValue: (value: 'existing' | 'new') => void
}

export function LeaderSearchCard({
  setExistingLeader,
  setTabsValue,
}: LeaderSearchCardProps) {
  const [commandQueryValue, setCommandQueryValue] = React.useState('')

  const queryHook = React.useCallback(
    (query: string, search: (query: string) => void) => {
      search(query)
    },
    [],
  )

  const { query, refine } = useSearchBox({
    queryHook,
  })

  const setQuery = (query: string) => {
    console.log('query', query)
    setCommandQueryValue(query)
    refine(query)
  }

  return (
    <Card className="h-full">
      <div className="flex items-center border-b px-3">
        <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <Input
          placeholder="Name..."
          value={commandQueryValue}
          onChange={(e) => setQuery(e.target.value)}
          className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <EmptyQueryBoundary fallback={null}>
        <Hits
          setExistingLeader={setExistingLeader}
          setTabsValue={setTabsValue}
        />
      </EmptyQueryBoundary>
    </Card>
  )
}

function Hits({
  setExistingLeader,
  setTabsValue,
}: {
  setExistingLeader: (leader: Leader) => void
  setTabsValue: (value: 'existing' | 'new') => void
}) {
  const { items } = useHits<SearchLeaderHit>()

  return (
    <div>
      {items.map((item) => (
        <Hit
          key={item.objectID}
          item={item}
          setExistingLeader={setExistingLeader}
          setTabsValue={setTabsValue}
        />
      ))}
    </div>
  )
}

function Hit({
  item,
  setExistingLeader,
  setTabsValue,
}: {
  item: SearchLeaderHit
  setExistingLeader: (leader: Leader) => void
  setTabsValue: (value: 'existing' | 'new') => void
}) {
  const { toast } = useToast()
  const handleClick = async () => {
    const result = await serverGetRootLeader({
      leaderId: item.objectID,
    })
    if (result.success && result.rootLeader) {
      setExistingLeader(result.rootLeader)
      setTabsValue('existing')
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
    }
  }
  return (
    <div className="border border-x-0 border-t-0 border-b-border">
      <Button
        className="w-full justify-start rounded-none bg-transparent text-foreground hover:text-primary-foreground"
        variant="default"
        onClick={handleClick}
      >
        {item.FirstName} {item.MidName} {item.LastName}
      </Button>
    </div>
  )
}

function EmptyQueryBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode
  fallback: React.ReactNode
}) {
  const { indexUiState } = useInstantSearch()

  if (!indexUiState.query) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    )
  }

  return children
}
