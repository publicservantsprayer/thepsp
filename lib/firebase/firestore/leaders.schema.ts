import { z } from 'zod'
import {
  zodFirestoreDocumentId,
  zodFirestoreDocumentReference,
  zodFirestoreTimestamp,
} from './zod-firestore-schemas'
import { stateCodeSchema } from './states.schema'

export const leaderUtilitySchema = z.object({
  permaLink: z
    .string()
    .optional()
    .describe('The permanent link of made up of the name and id'),
  lastImportDate: zodFirestoreTimestamp.describe(
    'The date the data was last imported',
  ),
  hasPhoto: z
    .boolean()
    .describe('Whether the public official has a photo or not'),
  photoFile: z.string().optional().describe('The file name of the photo'),
  stateCode: stateCodeSchema.describe(
    'The uppercase, two digit state code where the public official serves',
  ),
})

export const leaderPersonalSchema = z.object({
  // Personal Information
  FirstName: z.string().describe('The first name of the public official'),
  LastName: z.string().describe('The last name of the public official'),
  LegalName: z.string().describe('The full legal name of the public official'),
  NickName: z
    .string()
    .optional()
    .describe('The nickname of the public official'),
  BirthDate: z
    .string()
    .describe('The numeric birth day of the month of the public official'),
  BirthMonth: z
    .string()
    .describe('The numeric birth month of the year of the public official'),
  BirthYear: z
    .string()
    .describe('The numeric birth year of the public official'),
  BirthPlace: z
    .string()
    .describe('The city and state of the birthplace of the public official'),
  Gender: z
    .enum(['M', 'F'])
    .describe('The biological sex of the public official'),

  // Family and Residence
  Marital: z
    .string()
    .optional()
    .describe('The marital status of the public official'),
  Spouse: z
    .string()
    .optional()
    .describe('The name of the spouse of the public official'),
  Family: z
    .string()
    .describe('How many children the public official has, if any'),
  Residence: z
    .string()
    .describe('The city and state of the residence of the public official'),

  // Office and Beliefs
  Title: z.string().describe('The title of the public official'),
  ElectDate: z.string().describe('The date the public official was elected'),
  Party: z.string().describe('The political party of the public official'),
  Religion: z
    .string()
    .describe('The religious affiliation of the public official'),

  // Social Media and Contact
  TwitterHandle: z
    .string()
    .optional()
    .describe(
      'The official X (Twitter) platform handle of the public official',
    ),
  Facebook: z
    .string()
    .optional()
    .describe('The official Facebook page (URL) of the public official'),
  Website: z
    .string()
    .optional()
    .describe('The official website of the public official'),
  Email: z
    .string()
    .optional()
    .describe('The official email address of the public official'),
})

export const leaderAuthoritySchema = z.object({
  jurisdiction: z
    .enum(['federal', 'state'])
    .describe('The jurisdiction (state or federal) of the public official'),
  branch: z
    .enum(['executive', 'legislative', 'judicial'])
    .describe('The branch of government the public official serves in'),
  federalExecutiveOffice: z
    .enum(['president', 'vice-president', 'secretary-of-state'])
    .optional(),
  stateExecutiveOffice: z
    .enum(['governor', 'lieutenant-governor', 'secretary-of-state'])
    .optional(),
  legislativeChamber: z.enum(['upper', 'lower']).optional(),
})

/**
 * Structured for querying AI (no utility fields)
 */
// export const leaderAiQuerySchema = z.object({
//   name: z.string().min(1, { message: 'Required' }),
//   age: z.number().min(10),
// })
// .merge(leaderPersonalSchema)
// .merge(leaderAuthoritySchema)

/**
 * Includes only fields in the database
 * (no id or dto fields)
 * Used for removing non-database fields in the FirestoreDataConverter
 */
export const leaderDbSchema = z
  .object({})
  .merge(leaderUtilitySchema)
  .merge(leaderPersonalSchema)
  .merge(leaderAuthoritySchema)

/**
 * Includes only fields in the database
 * as well as possible zod refinements.
 *
 * Used for removing non-database fields in the FirestoreDataConverter.
 */
export const leaderDbParser = leaderDbSchema.superRefine(superRefine)

/**
 * Includes all fields in the database plus id
 * sanitized for serialization
 */
export const leaderDtoSchema = leaderDbSchema.extend({
  id: zodFirestoreDocumentId,
  lastImportDate: z.date(),
})

/**
 * Includes fields in the database as well as fields added
 * by the Firestore converter
 * DocumentRefs are still objects, but converted to
 * serializable objects in the DTO
 */
export const leaderSchema = leaderDbSchema.extend({
  id: zodFirestoreDocumentId,
  lastImportDate: z.date(),
  dto: leaderDtoSchema,
  ref: zodFirestoreDocumentReference.describe(
    'The DocumentReference to this leader',
  ),
})

export const newLeaderSchema = leaderSchema
  .omit({
    id: true,
    dto: true,
    ref: true,
  })
  .extend({
    // id: zodFirestoreDocumentId.optional(),
    // lastImportDate: z.date(),
    // dto: leaderDtoSchema,
    // ref: zodFirestoreDocumentReference,
  })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function superRefine(data: any, ctx: z.RefinementCtx) {
  // Federal executive requires federalExecutiveOffice
  if (
    data.jurisdiction === 'federal' &&
    data.branch === 'executive' &&
    !data.federalExecutiveOffice
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Federal executive position requires federalExecutiveOffice',
      path: ['federalExecutiveOffice'],
    })
  }

  // State executive requires stateExecutiveOffice
  if (
    data.jurisdiction === 'state' &&
    data.branch === 'executive' &&
    !data.stateExecutiveOffice
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'State executive position requires stateExecutiveOffice',
      path: ['stateExecutiveOffice'],
    })
  }

  // Mutually exclusive executive offices
  if (data.federalExecutiveOffice && data.stateExecutiveOffice) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Cannot have both federal and state executive offices',
      path: ['stateExecutiveOffice'],
    })
  }

  // Legislative branch requirements
  if (data.branch === 'legislative') {
    if (!data.legislativeChamber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Legislative branch requires legislativeChamber',
        path: ['legislativeChamber'],
      })
    }
    if (data.federalExecutiveOffice || data.stateExecutiveOffice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Legislative branch cannot have executive offices',
        path: ['branch'],
      })
    }
  }

  // Judicial branch restrictions
  if (data.branch === 'judicial') {
    if (
      data.legislativeChamber ||
      data.federalExecutiveOffice ||
      data.stateExecutiveOffice
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Judicial branch cannot have legislative or executive properties',
        path: ['branch'],
      })
    }
  }
}
