import { authedRequest } from "../http"
import type {
  Message,
  CreateMessageInput,
  ReplyToMessageInput,
  UpdateMessageStatusInput,
  MessagesListResponse,
  GetMessagesParams,
} from "../types/messages"

export const messagesApi = {
  getMyMessages: async (): Promise<Message[]> => {
    return authedRequest<Message[]>("/v1/messages/me")
  },

  list: async (
    params?: GetMessagesParams,
  ): Promise<MessagesListResponse> => {
    const queryParams = new URLSearchParams()

    if (params?.status) queryParams.append("status", params.status)

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ""

    return authedRequest<MessagesListResponse>(`/v1/messages/${query}`)
  },

  create: async (data: CreateMessageInput): Promise<Message> => {
    return authedRequest<Message>("/v1/messages/", {
      method: "POST",
      body: data,
    })
  },

  reply: async (
    id: string,
    data: ReplyToMessageInput,
  ): Promise<Message> => {
    return authedRequest<Message>(`/v1/messages/${id}/reply`, {
      method: "POST",
      body: data,
    })
  },

  updateStatus: async (
    id: string,
    data: UpdateMessageStatusInput,
  ): Promise<Message> => {
    return authedRequest<Message>(`/v1/messages/${id}/status`, {
      method: "PATCH",
      body: data,
    })
  },
}
