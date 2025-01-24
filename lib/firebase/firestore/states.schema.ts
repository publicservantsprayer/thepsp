import { z } from 'zod'
import { zodFirestoreDocumentReference } from './zod-firestore-schemas'

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
 * Includes all fields in the database plus id
 * sanitized for serialization
 */
export const stateDtoSchema = stateDbSchema
  .omit({
    governorRef: true,
    lieutenantGovernorRef: true,
    secretaryOfStateRef: true,
  })
  .extend({
    id: stateCodeSchema,
  })

/**
 * Includes only fields in the database
 * as well as possible zod refinements.
 *
 * Used for removing non-database fields in the FirestoreDataConverter.
 */
export const stateDbParser = stateDbSchema

export const stateSchema = stateDbSchema.extend({
  id: stateCodeSchema,
  dto: stateDtoSchema,
  ref: zodFirestoreDocumentReference,
})
