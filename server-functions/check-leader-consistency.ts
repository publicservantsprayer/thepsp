'use server'

import { stateCodes } from '@/data/states'
import {
  getCollectionGroupLeaderByPermaLink,
  getStateLeaders,
  mustGetRootLeaderById,
} from '@/lib/firebase/firestore'
import { storage } from '@/lib/firebase/server/admin-app'
import { mustGetCurrentAdmin } from '@/lib/firebase/server/auth'
import { makeValidStateCode } from '@/lib/get-state-info'
import type { StateCode } from '@/lib/types'
import { getDownloadURL } from 'firebase-admin/storage'

// TODO: This is a one time script
export const checkLeadersForPhoto = async (stateCode: StateCode) => {
  await mustGetCurrentAdmin()

  const bucket = storage.bucket('repsp123-leaders')

  await Promise.all(
    stateCodes.map(async (stateCode) => {
      // Get leaders without a photo
      const leaders = await getStateLeaders({ stateCode })
      await Promise.all(
        leaders.map(async (leader) => {
          if (!leader.PhotoFile) {
            console.log(
              `Leader ${leader.FirstName} ${leader.LastName} in ${stateCode} does not have a PhotoFile`,
            )
          } else {
            const fileRef = bucket.file(`${leader.PhotoFile}`)
            const [exists] = await fileRef.exists()
            if (exists) {
              // console.log(
              //   `Leader ${leader.FirstName} ${leader.LastName} in ${stateCode} has a photo`,
              // )
              // const downloadURL = await getDownloadURL(fileRef)
              // console.log(downloadURL)
            } else {
              const rootLeader = await mustGetRootLeaderById(leader.ref.id)
              if (rootLeader) {
                if (rootLeader.PhotoFile !== leader.PhotoFile) {
                  console.log(
                    'PhotoFile does not match, rootLeader: ',
                    rootLeader.PhotoFile,
                    'leader: ',
                    leader.PhotoFile,
                  )
                } else {
                  // console.log(
                  //   `!!Leader ${leader.FirstName} ${leader.LastName} in ${stateCode} has a PhotoFile and matches root, but no photo`,
                  // )
                }
              } else {
                console.log('No root leader')
              }
            }
          }
        }),
      )
    }),
  )
  // return result

  // const file = 'McCoy_Tennille_839238'

  // const fileRef = bucket.file(`${file}`)
  // const [exists] = await fileRef.exists()
  // if (exists) {
  //   console.log('it exists!!!')
  //   // console.log(
  //   //   `Leader ${leader.FirstName} ${leader.LastName} in ${stateCode} has a photo`,
  //   // )
  //   const downloadURL = await getDownloadURL(fileRef)
  //   console.log(downloadURL)
  // } else {
  //   console.log(
  //     // `!!Leader ${leader.FirstName} ${leader.LastName} in ${stateCode} has a PhotoFile but no photo`,
  //     'nope',
  //   )
  // }
}
