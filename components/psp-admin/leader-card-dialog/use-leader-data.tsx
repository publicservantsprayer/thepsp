'use client'

import { useToast } from '@/components/hooks/use-toast'
import { serverGetRootLeader } from '@/server-functions/new-leaders/get-root-leader'
import { serverGetState } from '@/server-functions/get-state'
import { serverGetStateLeader } from '@/server-functions/new-leaders/get-state-leader'
import { District, Leader, NewLeaderForm, State } from '@/lib/types'
import React, { createContext, useContext, useState } from 'react'
import { serverSaveLeader } from '@/server-functions/new-leaders/save-leader'

interface LeaderDataContextType {
  rootLeader: Leader | undefined
  stateLeader: Leader | undefined
  isLoading: boolean
  state: State | undefined
  getRootAndStateLeader: () => Promise<void>
  leader: Leader
  setLeader: (leader: Leader) => void
  districts: District[] | undefined
  setDistricts: (districts: District[] | undefined) => void
  handleSaveLeader: (data: NewLeaderForm) => Promise<void>
}

const LeaderDataContext = React.createContext<
  LeaderDataContextType | undefined
>(undefined)

// Create a context for photo refresh events
const PhotoRefreshContext = createContext<{
  refreshTimestamp: number
  triggerPhotoRefresh: () => void
}>({
  refreshTimestamp: Date.now(),
  triggerPhotoRefresh: () => {},
})

export function LeaderDataProvider({
  initialLeader,
  initialState,
  initialDistricts,
  children,
}: {
  initialLeader: Leader
  initialState?: State
  initialDistricts?: District[]
  children: React.ReactNode
}) {
  const { toast } = useToast()
  const [leader, setLeader] = React.useState<Leader>(initialLeader)
  const [rootLeader, setRootLeader] = React.useState<Leader | undefined>()
  const [stateLeader, setStateLeader] = React.useState<Leader | undefined>()
  const [isLoading, setIsLoading] = React.useState(false)
  const [state, setState] = React.useState<State | undefined>(initialState)
  const [districts, setDistricts] = React.useState<District[] | undefined>(
    initialDistricts,
  )

  React.useEffect(() => {
    if (state) {
      return
    }
    const getAndSetState = async () => {
      const result = await serverGetState({
        stateCode: leader.StateCode,
      })
      if (!result.success) {
        toast({
          title: 'State not found',
          description: result.error,
        })
      }
      if (result.success) {
        setState(result.state)
      }
    }
    if (!state) {
      getAndSetState()
    }
  }, [leader.StateCode, state, toast])

  const getRootAndStateLeader = async () => {
    setIsLoading(true)
    const { rootLeader } = await serverGetRootLeader({
      leaderId: leader.ref.id,
    })
    setRootLeader(rootLeader)

    if (state) {
      const { stateLeader } = await serverGetStateLeader({
        leaderId: leader.ref.id,
        stateCode: state.ref.id,
      })
      setStateLeader(stateLeader)
    }

    setIsLoading(false)
  }

  const handleSaveLeader = async (data: NewLeaderForm) => {
    const result = await serverSaveLeader({
      leader: {
        ...leader,
        ...data,
      },
    })
    if (result.success) {
      toast({
        title: 'Leader saved.',
      })
      setLeader(result.leader!)
    } else {
      toast({
        title: 'Error',
        description: result.error,
      })
    }
  }

  const value = {
    leader,
    setLeader,
    rootLeader,
    stateLeader,
    isLoading,
    state,
    districts,
    setDistricts,
    getRootAndStateLeader,
    handleSaveLeader,
  }

  return (
    <LeaderDataContext.Provider value={value}>
      {children}
    </LeaderDataContext.Provider>
  )
}

export function useLeaderData() {
  const context = React.useContext(LeaderDataContext)
  if (context === undefined) {
    throw new Error('useLeaderData must be used within a LeaderDataProvider')
  }
  return context
}

// Create a provider component
export function PhotoRefreshProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [refreshTimestamp, setRefreshTimestamp] = useState(Date.now())

  const triggerPhotoRefresh = () => {
    setRefreshTimestamp(Date.now())
  }

  return (
    <PhotoRefreshContext.Provider
      value={{ refreshTimestamp, triggerPhotoRefresh }}
    >
      {children}
    </PhotoRefreshContext.Provider>
  )
}

// Create a hook to use the photo refresh context
export function usePhotoRefresh() {
  return useContext(PhotoRefreshContext)
}
