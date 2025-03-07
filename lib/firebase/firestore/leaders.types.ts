import { Timestamp } from 'firebase-admin/firestore'
import { z } from 'zod'
import {
  leaderSchema,
  leaderDbSchema,
  leaderAiQuerySchema,
  newLeaderSchema,
  stateExecutiveStructureSchema,
  jurisdictionSchema,
  branchSchema,
  federalExecutiveOfficeSchema,
  stateExecutiveOfficeSchema,
  legislativeChamberSchema,
  newLeaderFormSchema,
} from './leaders.schema'

export type Leader = z.infer<typeof leaderSchema>
export type LeaderDb = z.infer<typeof leaderDbSchema>
export type NewLeader = z.infer<typeof newLeaderSchema>

export type NewLeaderForm = z.infer<typeof newLeaderFormSchema>

export type Jurisdiction = z.infer<typeof jurisdictionSchema>
export type Branch = z.infer<typeof branchSchema>
export type FederalExecutiveOffice = z.infer<
  typeof federalExecutiveOfficeSchema
>
export type StateExecutiveOffice = z.infer<typeof stateExecutiveOfficeSchema>
export type LegislativeChamber = z.infer<typeof legislativeChamberSchema>

export type LeaderAiQuery = z.infer<typeof leaderAiQuerySchema>
export type StateExecutiveStructure = z.infer<
  typeof stateExecutiveStructureSchema
>

/**
 * @deprecated
 */
export interface OldLeaderDbType {
  BirthDate: string
  BirthMonth: string
  BirthPlace: string
  BirthYear: string
  Chamber: 'H' | 'S' // House or Senate
  Degree1: string
  Degree2: string
  Degree3: string
  District: string
  DistrictID: string
  EduDate1: string
  EduDate2: string
  EduDate3: string
  ElectDate: string
  Email: string
  Facebook: string
  Family: string
  FirstName: string
  Gender: string
  LastName: string
  LegType: 'FL' | 'SL' // Federal or State
  LegalName: string
  MailAddr1: string
  MailAddr2: string
  MailAddr3: string
  MailAddr5: string
  MailName: string
  MailTitle: string
  Marital: string
  MidName: string
  NickName: string
  PID: string
  PartyCode: string
  PhotoFile: string
  PhotoPath: string
  Prefix: string
  Residence: string
  Religion: string
  School1: string
  School2: string
  School3: string
  Spouse: string
  State: string
  StateCode: string
  Title: string
  Twitter: string
  Webform: string
  Website: string
  hasPhoto: boolean
  lastImportDate: Timestamp
  permaLink: string
}
