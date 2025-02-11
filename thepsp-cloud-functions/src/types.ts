export interface Leader {
  Title: string
  FirstName: string
  LastName: string
  PhotoFile: string
  hasPhoto: boolean
  permaLink: string
}

export interface Post {
  dateID: string // YYYY-MM-DD
  leader1: Leader
  leader2: Leader
  leader3: Leader
}
