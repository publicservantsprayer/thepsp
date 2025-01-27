'use server'

import {
  getStateLeaders,
  mergeUpdateStateLeaderById,
} from '@/lib/firebase/firestore'
import { storage } from '@/lib/firebase/server/admin-app'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import type { StateCode } from '@/lib/types'

export const checkLeadersForPhoto = async (stateCode: StateCode) => {
  await mustGetCurrentAdmin()

  const bucket = storage.bucket('repsp123-leaders')
  const result: string[] = []

  const leaders = await getStateLeaders({ stateCode })

  const setLeaderHasPhotoFalse = async (id: string) => {
    await mergeUpdateStateLeaderById({
      id,
      stateCode,
      data: { hasPhoto: false },
    })
  }

  await Promise.all(
    leaders.map(async (leader) => {
      // PhotoFile is a string like 'firstName-lastName-839238'
      // hasPhoto is a boolean
      if (!leader.PhotoFile) {
        if (leader.hasPhoto) {
          await setLeaderHasPhotoFalse(leader.ref.id)

          result.push(
            `${stateCode} ${leader.permaLink} | without photoFile updated`,
          )
        }
      } else {
        // leader does have photoFile, check if it actually exists
        const fileRef = bucket.file(`${leader.PhotoFile}`)
        const [photoExists] = await fileRef.exists()

        if (!photoExists) {
          if (leader.hasPhoto) {
            await setLeaderHasPhotoFalse(leader.ref.id)
            result.push(`${stateCode} | ${leader.permaLink} updated`)
          }
        }
      }
    }),
  )

  return result
}
