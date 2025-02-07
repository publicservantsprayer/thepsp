import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getStateInfo } from '@/lib/get-state-info'
import { District, Leader } from '@/lib/types'
import { cn } from '@/lib/utils'
import React from 'react'
import { LeaderCardDialog } from './psp-admin/leader-card-dialog'

interface LeaderCardProps {
  leader?: Leader
  stateLeader?: Leader
  stateLeaderDistrict?: District | undefined
  className?: string
}

export function LeaderCard({
  leader,
  stateLeader,
  stateLeaderDistrict,
  className,
}: LeaderCardProps) {
  if (!leader) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="text-muted-foreground">
            No leader selected
          </CardTitle>
        </CardHeader>
      </Card>
    )
  }

  const fullName = [
    leader.Prefix,
    leader.FirstName,
    leader.MidName,
    leader.LastName,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle>
          <LeaderCardDialog leader={leader}>{fullName}</LeaderCardDialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 text-sm">
          {/* Personal Information */}
          <div className="space-y-2">
            <h3 className="font-semibold">Personal Information</h3>
            <div className="space-y-1">
              {leader.Title && (
                <div>
                  <span className="text-muted-foreground">Title:</span>{' '}
                  {leader.Title}
                </div>
              )}
              {leader.Gender && (
                <div>
                  <span className="text-muted-foreground">Gender:</span>{' '}
                  {leader.Gender === 'M' ? 'Male' : 'Female'}
                </div>
              )}
              {(leader.BirthMonth || leader.BirthDate || leader.BirthYear) && (
                <div>
                  <span className="text-muted-foreground">Birth:</span>{' '}
                  {[leader.BirthMonth, leader.BirthDate, leader.BirthYear]
                    .filter(Boolean)
                    .join('/')}
                </div>
              )}
              {leader.BirthPlace && (
                <div>
                  <span className="text-muted-foreground">Birth Place:</span>{' '}
                  {leader.BirthPlace}
                </div>
              )}
              {leader.Religion && (
                <div>
                  <span className="text-muted-foreground">Religion:</span>{' '}
                  {leader.Religion}
                </div>
              )}
            </div>
          </div>

          {/* Family Information */}
          <div className="space-y-2">
            <h3 className="font-semibold">Family Information</h3>
            <div className="space-y-1">
              {leader.Marital && (
                <div>
                  <span className="text-muted-foreground">Marital Status:</span>{' '}
                  {leader.Marital}
                </div>
              )}
              {leader.Spouse && (
                <div>
                  <span className="text-muted-foreground">Spouse:</span>{' '}
                  {leader.Spouse}
                </div>
              )}
              {leader.Family && (
                <div>
                  <span className="text-muted-foreground">Family:</span>{' '}
                  {leader.Family}
                </div>
              )}
              {leader.Residence && (
                <div>
                  <span className="text-muted-foreground">Residence:</span>{' '}
                  {leader.Residence}
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <h3 className="font-semibold">Contact Information</h3>
            <div className="space-y-1">
              {leader.Email && (
                <div>
                  <span className="text-muted-foreground">Email:</span>{' '}
                  <a
                    href={`mailto:${leader.Email}`}
                    className="text-primary hover:underline"
                  >
                    {leader.Email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Web Presence */}
          {(leader.Website ||
            leader.Facebook ||
            leader.TwitterHandle ||
            leader.BallotpediaPage ||
            leader.WikipediaPage) && (
            <div className="col-span-2 space-y-2">
              <h3 className="font-semibold">Web & Social Media</h3>
              <div className="space-y-1">
                {leader.Website && (
                  <div>
                    <span className="text-muted-foreground">Website:</span>{' '}
                    <a
                      href={leader.Website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {leader.Website}
                    </a>
                  </div>
                )}
                {leader.Facebook && (
                  <div>
                    <span className="text-muted-foreground">Facebook:</span>{' '}
                    <a
                      href={leader.Facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {leader.Facebook}
                    </a>
                  </div>
                )}
                {leader.TwitterHandle && (
                  <div>
                    <span className="text-muted-foreground">Twitter:</span>{' '}
                    <a
                      href={`https://twitter.com/${leader.TwitterHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      @{leader.TwitterHandle}
                    </a>
                  </div>
                )}
                {leader.BallotpediaPage && (
                  <div>
                    <span className="text-muted-foreground">Ballotpedia:</span>{' '}
                    <a
                      href={leader.BallotpediaPage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Profile
                    </a>
                  </div>
                )}
                {leader.WikipediaPage && (
                  <div>
                    <span className="text-muted-foreground">Wikipedia:</span>{' '}
                    <a
                      href={leader.WikipediaPage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Article
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Political Office */}
          <div className="space-y-2">
            <h3 className="font-semibold">Political Office</h3>
            <div className="space-y-1">
              <div>
                <span className="text-muted-foreground">
                  Currently Serving:
                </span>{' '}
                {stateLeader ? 'Yes' : 'No'}
              </div>
              {leader.StateCode && (
                <div>
                  <span className="text-muted-foreground">State:</span>{' '}
                  {getStateInfo(leader.StateCode).stateName || leader.StateCode}
                </div>
              )}
              {leader.ElectDate && (
                <div>
                  <span className="text-muted-foreground">Elected:</span>{' '}
                  {leader.ElectDate}
                </div>
              )}
              {(leader.Chamber || leader.LegType) && (
                <div>
                  <span className="text-muted-foreground">
                    Old Office Code:
                  </span>{' '}
                  {leader.LegType} : {leader.Chamber}
                </div>
              )}
              {stateLeaderDistrict && (
                <div>
                  <span className="text-muted-foreground">District:</span>{' '}
                  {stateLeaderDistrict.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
