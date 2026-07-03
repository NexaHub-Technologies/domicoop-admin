import { authedRequest } from "../http"
import type {
  Contribution,
  GetContributionsParams,
  ContributionListResponse,
  CreateContributionInput,
  UpdateContributionStatusInput,
} from "../types/contributions"

export const contributionsApi = {
  getMyContributions: async (
    params?: GetContributionsParams,
  ): Promise<ContributionListResponse> => {
    const queryParams = new URLSearchParams()

    if (params?.year) queryParams.append("year", params.year.toString())
    if (params?.month) queryParams.append("month", params.month)
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ""

    return authedRequest<ContributionListResponse>(
      `/v1/contributions/me${query}`,
    )
  },

  list: async (
    params?: GetContributionsParams,
  ): Promise<ContributionListResponse> => {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())
    if (params?.status) queryParams.append("status", params.status)
    if (params?.member_id) queryParams.append("member_id", params.member_id)
    if (params?.year) queryParams.append("year", params.year.toString())

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ""

    return authedRequest<ContributionListResponse>(
      `/v1/contributions/${query}`,
    )
  },

  getById: async (id: string): Promise<Contribution> => {
    return authedRequest<Contribution>(`/v1/contributions/${id}`)
  },

  create: async (data: CreateContributionInput): Promise<Contribution> => {
    return authedRequest<Contribution>("/v1/contributions/", {
      method: "POST",
      body: data,
    })
  },

  updateStatus: async (
    id: string,
    data: UpdateContributionStatusInput,
  ): Promise<Contribution> => {
    return authedRequest<Contribution>(`/v1/contributions/${id}/status`, {
      method: "PATCH",
      body: data,
    })
  },
}
