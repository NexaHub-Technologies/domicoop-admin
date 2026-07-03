export interface Notification {
  id: string
  title: string
  body: string
  type?: string
  data?: Record<string, string>
  read: boolean
  created_at: string
}

export interface NotificationsListResponse {
  data: Notification[]
  meta: {
    total: number
    page: number
    limit: number
    total_pages: number
    unread_count: number
  }
}

export interface GetNotificationsParams {
  page?: number
  limit?: number
}

export interface RegisterDeviceInput {
  token: string
  platform: "ios" | "android"
  device_name?: string
}

export interface UnregisterDeviceInput {
  token: string
}

export interface NotificationPreferences {
  push_enabled: boolean
  categories: {
    loan: boolean
    contribution: boolean
    dividend: boolean
    security: boolean
    meeting: boolean
  }
}

export interface UpdateNotificationPreferencesInput {
  push_enabled?: boolean
  categories?: {
    loan?: boolean
    contribution?: boolean
    dividend?: boolean
    security?: boolean
    meeting?: boolean
  }
}

export interface SendPushTestInput {
  to: string
  title: string
  body: string
  data?: Record<string, unknown>
  sound?: string
  priority?: "default" | "normal" | "high"
}

export interface BroadcastNotificationInput {
  title: string
  body: string
  type?: "loan" | "contribution" | "dividend" | "security" | "meeting"
  member_ids?: string[]
  data?: Record<string, string>
  action?: {
    label: string
    url: string
  }
}

// POST /notifications/broadcast → 200 { sent }
export interface BroadcastResponse {
  sent: number
}
