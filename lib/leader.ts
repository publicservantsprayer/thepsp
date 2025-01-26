import type { Leader, PostLeader } from '@/lib/types'

export const leaderPhoto = (leader: PostLeader) => {
  if (!leader.PhotoFile) return '/images/no-image.jpg'

  return `https://firebasestorage.googleapis.com/v0/b/repsp123-leaders/o/${leader.PhotoFile}?alt=media`
}

export const leaderUrl = (leader: Leader) => {
  return `/leader/${leader.permaLink}`
}
