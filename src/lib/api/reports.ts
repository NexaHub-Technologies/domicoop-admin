import { authedRequest } from "../http"
import type { ReportSummary, GetReportParams } from "../types/reports"

export const reportsApi = {
  getSummary: async (params?: GetReportParams): Promise<ReportSummary> => {
    const queryParams = new URLSearchParams()

    if (params?.year) queryParams.append("year", params.year.toString())

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ""

    return authedRequest<ReportSummary>(`/v1/reports/summary${query}`)
  },
}
