import { Timestamp } from 'firebase/firestore'
import { states } from '@/data/states'

export type StateCode = keyof typeof states

export interface LeaderDbType {
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

export interface Leader extends Omit<LeaderDbType, 'lastImportDate'> {
  id: string
  lastImportDate: Date
}

export interface PostDbType {
  dateID: string // 'YYYY-MM-DD'
  leader1: Leader
  leader2: Leader
  leader3: Leader
}

export interface Post extends PostDbType {
  id: string
}
