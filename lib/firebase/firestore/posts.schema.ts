import { z } from 'zod'
import { leaderSchema } from './leaders.schema'

// Historical copy of leaders, may not have all fields
export const postLeaderSchema = leaderSchema
  .partial()
  .extend({ permaLink: leaderSchema.shape.permaLink })

/**
 * Includes only fields in the database
 * (no id or dto fields)
 * Used for removing non-database fields in the FirestoreDataConverter
 */
export const postDbSchema = z.object({
  dateID: z.string(),
  leader1: postLeaderSchema,
  leader2: postLeaderSchema,
  leader3: postLeaderSchema,
})

/**
 * Includes fields in the database as well as fields added
 * or converted by the Firestore converter.
 * Additional `ref` field is added for the document reference.
 * Timestamps are converted to Date objects.
 * DocumentRefs are converted to serializable objects.
 */
export const postSchema = postDbSchema.extend({
  id: z.string(),
  ref: z.object({
    id: z.string(),
    path: z.string(),
  }),
})

/**
 * Includes only fields in the database
 * as well as possible zod refinements.
 *
 * Used for removing non-database fields in the FirestoreDataConverter.
 */
export const postSchemaNoId = postDbSchema.strip()
