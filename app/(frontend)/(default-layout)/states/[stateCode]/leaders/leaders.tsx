import React from 'react'
import { leaderPhoto, leaderUrl } from '@/lib/leader'
import { Leader } from '@/lib/types'
import { Link } from '@/components/ui/link'
import Image from 'next/image'

interface Props {
  leaders: Leader[]
  chamber: Leader['Chamber']
  legType: Leader['LegType']
}

export const Leaders = ({ leaders, chamber, legType }: Props) => {
  if (!leaders) return null

  function alphabetical(leaderA: Leader, leaderB: Leader) {
    if (leaderA.LastName < leaderB.LastName) {
      return -1
    }
    if (leaderA.LastName > leaderB.LastName) {
      return 1
    }
    return 0
  }

  leaders.sort(alphabetical)

  leaders = leaders.filter((leader) => {
    return leader.Chamber === chamber && leader.LegType === legType
  })

  return (
    <>
      {leaders.map((leader) => (
        <div key={leader.ref.id} className="m-1">
          <Link href={leaderUrl(leader)}>
            <div>
              <div className="p-1">
                <div className="flex min-w-[145px] justify-center">
                  <Image
                    alt={leader.fullname || ''}
                    src={leaderPhoto(leader)}
                    width={108}
                    height={148}
                    className="m-[10px] h-[60px] w-[60px]"
                  />
                </div>
                <div className="text-center text-sm">
                  {leader.NickName} {leader.LastName}
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </>
  )
}
