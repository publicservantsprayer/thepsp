'use client'

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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { InstantSearch } from 'react-instantsearch'

import {
  District,
  Jurisdiction,
  Leader,
  LegislativeChamber,
  State,
  Branch,
} from '@/lib/types'
import React from 'react'
import { SquareX } from 'lucide-react'
import { DeleteLeaderDialog } from './delete-leader-dialog'
import { AddLeaderDialog } from './add-leader-dialog'
import { liteClient as algoliasearch } from 'algoliasearch/lite'
import { LeaderCardDialog } from '@/components/psp-admin/leader-card-dialog'
import { leaderAlgoliaIndex } from '@/lib/firebase/env'
import { LeaderPhoto } from '@/components/psp-admin/leader-photo'
const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_CLIENT_SEARCH_API_KEY || '',
)

export function DistrictManageDialog({
  state,
  district,
  leaders,
  oldLeaders,
  jurisdiction,
  legislativeChamber,
  branch,
  children,
}: {
  state: State
  district: District
  leaders: Leader[]
  oldLeaders: Leader[]
  jurisdiction: Jurisdiction
  legislativeChamber: LegislativeChamber
  branch: Branch
  children?: React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>
            {state.name} - {district.name}
          </DialogTitle>
          <DialogDescription>
            Manage legislative leaders for {district.name} in {state.name}.
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableCaption></TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 py-2"></TableHead>
              <TableHead className="py-2">Name</TableHead>
              <TableHead className="py-2">Residence</TableHead>
              <TableHead className="py-2">Photo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaders.map((leader, i) => {
              return (
                <TableRow key={i}>
                  <TableCell className="py-2">
                    <DeleteLeaderDialog state={state} leader={leader}>
                      <SquareX size={16} />
                    </DeleteLeaderDialog>
                  </TableCell>
                  <TableCell className="py-2">
                    <LeaderCardDialog leader={leader} state={state}>
                      <span className="hover:underline">
                        {leader.Prefix}
                        {leader.fullname}
                      </span>
                    </LeaderCardDialog>
                  </TableCell>
                  <TableCell className="py-2">{leader.Residence}</TableCell>
                  <TableCell className="py-2">
                    <LeaderPhoto leader={leader} />
                  </TableCell>
                </TableRow>
              )
            })}
            {oldLeaders.map((leader, i) => {
              return (
                <TableRow key={i} className="text-muted">
                  <TableCell className="py-2">
                    <DeleteLeaderDialog state={state} leader={leader}>
                      <SquareX size={16} />
                    </DeleteLeaderDialog>
                  </TableCell>
                  <TableCell className="py-2">
                    {leader.Prefix}
                    {leader.fullname}
                  </TableCell>
                  <TableCell className="py-2">{leader.Residence}</TableCell>
                  <TableCell className="py-2">
                    <LeaderPhoto leader={leader} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className="flex justify-end">
          <InstantSearch
            indexName={leaderAlgoliaIndex}
            searchClient={searchClient}
          >
            <AddLeaderDialog
              state={state}
              district={district}
              jurisdiction={jurisdiction}
              legislativeChamber={legislativeChamber}
              branch={branch}
            >
              <Button>Add New Leader</Button>
            </AddLeaderDialog>
          </InstantSearch>
        </div>
      </DialogContent>
    </Dialog>
  )
}
