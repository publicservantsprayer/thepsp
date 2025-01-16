'use server'

import {
  getLeaders,
  mergeUpdateStateLeaderById,
} from '@/lib/firebase/firestore'
import { storage } from '@/lib/firebase/server/admin-app'
import type { StateCode } from '@/lib/types'

export const checkLeadersForPhoto = async (stateCode: StateCode) => {
  const bucket = storage.bucket('repsp123-leaders')
  const result: string[] = []
  let leadersUpdated = 0

  const leaders = await getLeaders({ stateCode })

  const setLeaderHasPhotoFalse = async (id: string) => {
    await mergeUpdateStateLeaderById({
      id,
      stateCode,
      data: { hasPhoto: false },
    })
    leadersUpdated++
  }

  await Promise.all(
    leaders.map(async (leader) => {
      // PhotoFile is a string like 'firstName-lastName-839238'
      // hasPhoto is a boolean
      if (!leader.PhotoFile) {
        if (leader.hasPhoto) {
          await setLeaderHasPhotoFalse(leader.id)

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
            await setLeaderHasPhotoFalse(leader.id)
            result.push(`${stateCode} | ${leader.permaLink} updated`)
          }
        }
      }
      result.push(`Updated ${leadersUpdated} leaders.`)
    }),
  )

  return result
}
