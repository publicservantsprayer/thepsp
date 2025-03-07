import { z } from 'zod'
import {
  zodFirestoreDocumentReference,
  zodSimpleDocumentRef,
} from './zod-firestore-schemas'
import { stateCodeSchema } from './states/states.schema'

// List of fields indexed
// permaLink,lastImportDate,hasPhoto,stateCode,FirstName,LastName,LegalName,NickName,BirthDate,BirthMonth,BirthYear,BirthPlace,Gender,Marital,Spouse,Family,Residence,ElectDate,Party,Religion,TwitterHandle,Facebook,Website,Email,jurisdiction,branch,federalExecutiveOffice,stateExecutiveOffice,legislativeChamber,Title,stateCode,photoFile

export const leaderUtilitySchema = z.object({
  permaLink: z
    .string()
    .default('')
    .describe('The permanent link made up of the name and id'),
  hasPhoto: z
    .boolean()
    .default(false)
    .optional()
    .describe('Whether the public official has a photo or not'),
  PhotoFile: z
    .string()
    .optional()
    .describe('The file name of the thumbnail photo'),
  photoUploadOriginal: z.string().optional(),
  photoUploadCropped: z.string().optional(),
  StateCode: stateCodeSchema.describe(
    'The uppercase, two digit state code where the public official serves',
  ),

  // From KnowWho
  District: z.string().optional(),
  DistrictID: z.string().optional(),
  Chamber: z.string().optional(),
  LegType: z.string().optional(),
  // PID: z.string().optional(),  // replace with leader.ref.id
})

// These need default values for controlled form fields
// !!! For now keep this manually in sync with the schema in the frontend
const leaderPersonalSchema = z.object({
  // Personal Information
  FirstName: z
    .string()
    .default('')
    .describe('The first name of the public official'),
  LastName: z
    .string()
    .default('')
    .describe('The last name of the public official'),
  MidName: z
    .string()
    .default('')
    .describe(
      'The middle name initial or abbreviation (followed by a dot) of the public official',
    ),
  Prefix: z
    .enum([
      'Sen.',
      'Rep.',
      'U.S. Sen.',
      'U.S. Rep.',
      'Gov.',
      'Lt. Gov.',
      'SOS.',
      'J.',
      'CJ.',
      '',
    ])
    .default('') // default to empty string, however, required to non-empty in leader form
    .describe('The prefix of the public official'),
  BirthDate: z
    .string()
    .default('')
    .describe('The numeric birth day of the month of the public official'),
  BirthMonth: z
    .string()
    .default('')
    .describe('The numeric birth month of the year of the public official'),
  BirthYear: z
    .string()
    .default('')
    .describe('The numeric birth year of the public official'),
  BirthPlace: z
    .string()
    .default('')
    .describe('The city and state of the birthplace of the public official'),
  Gender: z
    .enum(['', 'M', 'F'])
    .default('')
    .describe('The biological sex of the public official'),
  // Family and Residence
  Marital: z
    .string()
    .default('')
    .describe('The marital status of the public official'),
  Spouse: z
    .string()
    .default('')
    .describe('The name of the spouse of the public official'),
  Family: z
    .string()
    .default('')
    .describe(
      'How many children the public official has, if any.  Example: "3 children"',
    ),
  Residence: z
    .string()
    .default('')
    .describe('The city and state of the residence of the public official'),
  // Office and Beliefs
  Title: z.string().default('').describe('The title of the public official'),
  ElectDate: z
    .string()
    .default('')
    .describe('The date the public official was elected'),
  Religion: z
    .string()
    .default('')
    .describe('The religious affiliation of the public official'),
  // Social Media and Contact
  TwitterHandle: z
    .string()
    .default('')
    .describe(
      'The official X (Twitter) platform handle of the public official',
    ),
  Facebook: z
    .string()
    .default('')
    .describe('The official Facebook page (URL) of the public official'),
  Website: z
    .string()
    .default('')
    .describe('The official or personal website of the public official'),
  BallotpediaPage: z
    .string()
    .default('')
    .describe('The ballotpedia.com page of the public official'),
  WikipediaPage: z
    .string()
    .default('')
    .describe('The wikipedia.com page of the public official'),
  Email: z
    .string()
    .default('')
    .describe('The official email address of the public official'),
})

/**
 * Structured for creating a new leader form
 */
export const newLeaderFormSchema = leaderPersonalSchema
export const emptyNewLeaderWithDefaultValues = leaderPersonalSchema.parse({})
// console.log('emptyNewLeaderWithDefaultValues', emptyNewLeaderWithDefaultValues)

/**
 * Structured for querying AI (no utility fields)
 */
export const leaderAiQuerySchema = z
  .object({})
  .merge(leaderPersonalSchema)
  .default({})

/**
 * Executive Structure for querying AI
 */
export const stateExecutiveStructureSchema = z.object({
  // executiveBranchDescription: z
  //   .string()
  //   .optional()
  //   .describe('One paragraph description of the executive branch of the state'),
  governor: leaderAiQuerySchema.optional(),
  lieutenantGovernor: leaderAiQuerySchema.optional(),
  secretaryOfState: leaderAiQuerySchema.optional(),
})

export const singleLeaderAiQuerySchema = leaderAiQuerySchema.optional()

/**
 * Leader authority schema
 */
export const jurisdictionSchema = z.enum(['federal', 'state']) // also used in district schema
export const branchSchema = z.enum(['executive', 'legislative', 'judicial']) // also used in district schema
export const federalExecutiveOfficeSchema = z.enum([
  'president',
  'vice-president',
  'secretary-of-state',
])
export const stateExecutiveOfficeSchema = z.enum([
  'governor',
  'lieutenant-governor',
  'secretary-of-state',
])
export const legislativeChamberSchema = z.enum(['upper', 'lower'])
// Together they are the authority schema
export const leaderAuthoritySchema = z.object({
  jurisdiction: jurisdictionSchema.describe(
    'The jurisdiction (state or federal) of the public official',
  ),
  branch: branchSchema.describe(
    'The branch of government the public official serves in',
  ),
  federalExecutiveOffice: federalExecutiveOfficeSchema.optional(),
  stateExecutiveOffice: stateExecutiveOfficeSchema.optional(),
  legislativeChamber: legislativeChamberSchema.optional(),
})

/**
 * Includes only fields in the database
 * (no id or dto fields)
 * Used for removing non-database fields in the FirestoreDataConverter
 */
export const leaderDbSchema = z
  .object({
    // createdAt: zodFirestoreTimestamp.or(z.date()).optional(),
    // updatedAt: zodFirestoreTimestamp.or(z.date()).optional(),
    // lastImportDate: zodFirestoreTimestamp
    //   .or(z.date())
    //   .optional()
    //   .describe('The date the data was last confirmed to hold this office'),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    lastImportDate: z
      .date()
      .optional()
      .describe('The date the data was last confirmed to hold this office'),
    districtRef: zodFirestoreDocumentReference.optional(),
  })
  .merge(leaderUtilitySchema)
  .merge(leaderPersonalSchema)
  .merge(leaderAuthoritySchema)

/**
 * Includes fields in the database as well as fields added
 * or converted by the Firestore converter.
 * Additional `ref` field is added for the document reference.
 * Timestamps are converted to Date objects.
 * DocumentRefs are converted to serializable objects.
 */
export const leaderSchema = leaderDbSchema.extend({
  ref: zodSimpleDocumentRef,
  districtRef: zodSimpleDocumentRef.optional(),
  // ephemeral fields
  fullname: z.string().optional(),
  districtName: z.string().optional(),
})

export const newLeaderSchema = leaderSchema
  .omit({
    ref: true,
    permaLink: true,
    fullname: true,
  })
  .extend({
    // id: zodFirestoreDocumentId.optional(),
    // lastImportDate: z.date(),
    // dto: leaderDtoSchema,
    // ref: zodFirestoreDocumentReference,
  })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function leaderDbSuperRefine(data: any, ctx: z.RefinementCtx) {
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
