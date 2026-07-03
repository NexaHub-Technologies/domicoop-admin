import { authedRequest } from "../http"
import type {
  DividendsListResponse,
  PreviewDividendInput,
  PreviewDividendResponse,
  DistributeDividendInput,
  DistributeDividendResponse,
  GetDividendsParams,
} from "../types/dividends"

export const dividendsApi = {
  list: async (
    params?: GetDividendsParams,
  ): Promise<DividendsListResponse> => {
    const queryParams = new URLSearchParams()

    if (params?.year) queryParams.append("year", params.year.toString())

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ""

    return authedRequest<DividendsListResponse>(`/v1/dividends/${query}`)
  },

  preview: async (
    data: PreviewDividendInput,
  ): Promise<PreviewDividendResponse> => {
    return authedRequest<PreviewDividendResponse>("/v1/dividends/preview", {
      method: "POST",
      body: data,
    })
  },

  distribute: async (
    data: DistributeDividendInput,
  ): Promise<DistributeDividendResponse> => {
    return authedRequest<DistributeDividendResponse>(
      "/v1/dividends/distribute",
      {
        method: "POST",
        body: data,
      },
    )
  },
}
