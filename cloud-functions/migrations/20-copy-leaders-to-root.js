/* eslint-disable no-await-in-loop */
const admin = require('firebase-admin')
const serviceAccount = require('../../serviceAccountKey-staging.json')
const { stateCodes } = require('../utilities/states')

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
const db = admin.firestore()
const stateCount = stateCodes.length

;(async () => {
  console.log('copying leaders to root...')
  console.log('switching from permaLink to PID as the document id...')

  let stateIndex = 0
  for (const stateCode of stateCodes) {
    stateIndex++
    const leadersRef = db.collection('states').doc(stateCode).collection('leaders')
    const leaderDatas = (await leadersRef.get()).docs.map(leader => leader.data())
    const leaderCount = leaderDatas.length

    await Promise.all(
      leaderDatas.map(leaderData => db.collection('leaders').doc(leaderData.PID).set(leaderData))
    )
    console.log(`Copied ${leaderCount} leaders from ${stateCode} (${stateIndex}/${stateCount})`)
  }
})().catch(console.error)
