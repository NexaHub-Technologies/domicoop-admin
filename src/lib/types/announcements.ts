export interface Announcement {
  id: string
  title: string
  body: string
  published: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface CreateAnnouncementInput {
  title: string
  body: string
  published?: boolean
}

export interface UpdateAnnouncementInput {
  title?: string
  body?: string
  published?: boolean
}
