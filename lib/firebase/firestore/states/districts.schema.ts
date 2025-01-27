import { z } from 'zod'
import { zodSimpleDocumentRef } from '@/lib/firebase/firestore/zod-firestore-schemas'
import { jurisdictionSchema, legislativeChamberSchema } from '../leaders.schema'

/**
 * Includes only fields in the database
 * (no id or ref fields)
 * Used for removing non-database fields in the FirestoreDataConverter
 */
export const districtDbSchema = z.object({
  name: z.string(),
  jurisdiction: jurisdictionSchema,
  legislativeChamber: legislativeChamberSchema,
})

/**
 * Includes fields in the database as well as fields added
 * or converted by the Firestore converter.
 * Additional `ref` field is added for the document reference.
 * Timestamps are converted to Date objects.
 * DocumentRefs are converted to serializable objects.
 */
export const districtSchema = districtDbSchema.extend({
  ref: zodSimpleDocumentRef,
})

export const newDistrictSchema = districtSchema
  .omit({
    ref: true,
  })
  .extend({})

/**
 * Includes only fields in the database
 * as well as possible zod refinements.
 *
 * Used for removing non-database fields in the FirestoreDataConverter.
 */
export const districtDbParser = districtDbSchema.strip()
