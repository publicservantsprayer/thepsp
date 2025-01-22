import { z } from 'zod'

export const leaderSchema = z.object({
  FirstName: z.string().describe('The first name of the public official'),
  LastName: z.string().describe('The last name of the public official'),
  LegalName: z.string().describe('The full legal name of the public official'),
  Family: z
    .string()
    .describe('How many children the public official has, if any'),
  NickName: z
    .string()
    .optional()
    .describe('The nickname of the public official'),
  Title: z.string().describe('The title of the public official'),
  Party: z.string().describe('The political party of the public official'),
  Gender: z
    .enum(['M', 'F'])
    .describe('The biological sex of the public official'),
  Facebook: z
    .string()
    .optional()
    .describe('The official Facebook page (URL) of the public official'),
  TwitterHandle: z
    .string()
    .optional()
    .describe(
      'The official X (Twitter) platform handle of the public official',
    ),
  Website: z
    .string()
    .optional()
    .describe('The official website of the public official'),
  Email: z
    .string()
    .optional()
    .describe('The official email address of the public official'),
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
  Religion: z
    .string()
    .describe('The religious affiliation of the public official'),
  ElectDate: z.string().describe('The date the public official was elected'),
  Residence: z
    .string()
    .describe('The city and state of the residence of the public official'),
  Spouse: z
    .string()
    .optional()
    .describe('The name of the spouse of the public official'),
  Marital: z
    .string()
    .optional()
    .describe('The marital status of the public official'),
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

export const leaderDbSchema = leaderSchema
  .merge(leaderAuthoritySchema)
  .superRefine((data, ctx) => {
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
  })
