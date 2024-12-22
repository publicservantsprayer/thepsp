import { Timestamp } from 'firebase/firestore'

export interface Leader {
  BirthDate: string
  BirthMonth: string
  BirthPlace: string
  BirthYear: string
  Chamber: string
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
  FirstName: string
  Gender: string
  LastName: string
  LegType: string
  LegalName: string
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
  School1: string
  School2: string
  School3: string
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

export const leaderPhoto = (leader: Leader) => {
  return `https://firebasestorage.googleapis.com/v0/b/repsp123-leaders/o/${leader.PhotoFile}?alt=media`
}

export const leaderUrl = (leader: Leader) => {
  return `/leader/${leader.permaLink}`
}
