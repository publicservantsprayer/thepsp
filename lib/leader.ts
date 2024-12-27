import type { Leader } from './types'

export const leaderPhoto = (leader: Leader) => {
  return `https://firebasestorage.googleapis.com/v0/b/repsp123-leaders/o/${leader.PhotoFile}?alt=media`
}

export const leaderUrl = (leader: Leader) => {
  return `/leader/${leader.permaLink}`
}
