import { authedRequest } from "../http"
import type { Member } from "../types/auth"
import type {
  UpdateMemberInput,
  AdminUpdateMemberInput,
  CreateMemberInput,
  PaginatedMembersResponse,
  SecurityInfo,
  MemberStatement,
} from "../types/members"

export const membersApi = {
  getMe: async (): Promise<Member> => {
    return authedRequest<Member>("/v1/members/me")
  },

  updateMe: async (data: UpdateMemberInput): Promise<Member> => {
    return authedRequest<Member>("/v1/members/me", {
      method: "PATCH",
      body: data,
    })
  },

  getMySecurity: async (): Promise<SecurityInfo> => {
    return authedRequest<SecurityInfo>("/v1/members/me/security")
  },

  list: async (params?: {
    page?: number
    limit?: number
  }): Promise<PaginatedMembersResponse> => {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ""

    return authedRequest<PaginatedMembersResponse>(`/v1/members/${query}`)
  },

  create: async (data: CreateMemberInput): Promise<Member> => {
    return authedRequest<Member>("/v1/members/", {
      method: "POST",
      body: data,
    })
  },

  getById: async (id: string): Promise<Member> => {
    return authedRequest<Member>(`/v1/members/${id}`)
  },

  updateById: async (
    id: string,
    data: AdminUpdateMemberInput,
  ): Promise<Member> => {
    return authedRequest<Member>(`/v1/members/${id}`, {
      method: "PATCH",
      body: data,
    })
  },

  getPendingApplications: async (): Promise<Member[]> => {
    return authedRequest<Member[]>("/v1/members/applications/pending")
  },

  approve: async (id: string): Promise<Member> => {
    return authedRequest<Member>(`/v1/members/${id}/approve`, {
      method: "POST",
    })
  },

  getStatement: async (
    id: string,
    params?: { year?: number },
  ): Promise<MemberStatement> => {
    const queryParams = new URLSearchParams()
    if (params?.year) queryParams.append("year", params.year.toString())

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ""

    return authedRequest<MemberStatement>(
      `/v1/members/${id}/statement${query}`,
    )
  },
}
