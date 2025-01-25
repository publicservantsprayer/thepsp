import { z } from 'zod'
import {
  zodFirestoreDocumentReference,
  zodSimpleDocumentRef,
} from './zod-firestore-schemas'

export const stateCodeSchema = z.enum([
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
])

/**
 * Includes only fields in the database
 * (no id or dto fields)
 * Used for removing non-database fields in the FirestoreDataConverter
 */
export const stateDbSchema = z.object({
  name: z.string(),
  region: z.string(),
  governorRef: zodFirestoreDocumentReference.optional(),
  hasLieutenantGovernor: z.boolean(),
  lieutenantGovernorRef: zodFirestoreDocumentReference.optional(),
  hasSecretaryOfState: z.boolean(),
  secretaryOfStateRef: zodFirestoreDocumentReference.optional(),
})

/**
 * Includes fields in the database as well as fields added
 * or converted by the Firestore converter.
 * Additional `ref` field is added for the document reference.
 * Timestamps are converted to Date objects.
 * DocumentRefs are converted to serializable objects.
 */
export const stateSchema = stateDbSchema.omit({}).extend({
  ref: z.object({
    id: stateCodeSchema,
    path: z.string(),
  }),
  governorRef: zodSimpleDocumentRef.optional(),
  lieutenantGovernorRef: zodSimpleDocumentRef.optional(),
  secretaryOfStateRef: zodSimpleDocumentRef.optional(),
})

/**
 * Includes only fields in the database
 * as well as possible zod refinements.
 *
 * Used for removing non-database fields in the FirestoreDataConverter.
 */
export const stateDbParser = stateDbSchema
