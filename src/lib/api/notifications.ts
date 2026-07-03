import { authedRequest } from "../http"
import type {
  Notification,
  NotificationsListResponse,
  GetNotificationsParams,
  RegisterDeviceInput,
  UnregisterDeviceInput,
  NotificationPreferences,
  UpdateNotificationPreferencesInput,
  SendPushTestInput,
  BroadcastNotificationInput,
  BroadcastResponse,
} from "../types/notifications"

export const notificationsApi = {
  getMyNotifications: async (
    params?: GetNotificationsParams,
  ): Promise<NotificationsListResponse> => {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ""

    return authedRequest<NotificationsListResponse>(
      `/v1/notifications/me${query}`,
    )
  },

  deleteAll: async (): Promise<void> => {
    await authedRequest("/v1/notifications/me", { method: "DELETE" })
  },

  markAllRead: async (): Promise<void> => {
    await authedRequest("/v1/notifications/me/read-all", { method: "POST" })
  },

  markRead: async (id: string): Promise<Notification> => {
    return authedRequest<Notification>(`/v1/notifications/${id}/read`, {
      method: "PATCH",
    })
  },

  registerDevice: async (data: RegisterDeviceInput): Promise<void> => {
    await authedRequest("/v1/notifications/devices", {
      method: "POST",
      body: data,
    })
  },

  unregisterDevice: async (data: UnregisterDeviceInput): Promise<void> => {
    await authedRequest("/v1/notifications/devices/unregister", {
      method: "POST",
      body: data,
    })
  },

  getPreferences: async (): Promise<NotificationPreferences> => {
    return authedRequest<NotificationPreferences>(
      "/v1/notifications/preferences",
    )
  },

  updatePreferences: async (
    data: UpdateNotificationPreferencesInput,
  ): Promise<NotificationPreferences> => {
    return authedRequest<NotificationPreferences>(
      "/v1/notifications/preferences",
      {
        method: "PATCH",
        body: data,
      },
    )
  },

  sendTestPush: async (data: SendPushTestInput): Promise<void> => {
    await authedRequest("/v1/notifications/push/test", {
      method: "POST",
      body: data,
    })
  },

  broadcast: async (
    data: BroadcastNotificationInput,
  ): Promise<BroadcastResponse> => {
    return authedRequest<BroadcastResponse>("/v1/notifications/broadcast", {
      method: "POST",
      body: data,
    })
  },
}
