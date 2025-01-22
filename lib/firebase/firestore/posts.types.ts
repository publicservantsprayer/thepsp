import { Leader } from '@/lib/types'

export interface PostDbType {
  dateID: string // 'YYYY-MM-DD'
  leader1: Leader
  leader2: Leader
  leader3: Leader
}

export interface Post extends PostDbType {
  id: string
}
