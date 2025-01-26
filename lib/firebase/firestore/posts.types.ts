import { postLeaderSchema, postSchema } from './posts.schema'
import { z } from 'zod'

export type Post = z.infer<typeof postSchema>
export type PostDb = z.infer<typeof postSchema>

export type PostLeader = z.infer<typeof postLeaderSchema>
