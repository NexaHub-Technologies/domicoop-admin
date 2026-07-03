import { authedRequest } from "../http"
import type {
  Loan,
  ApplyLoanInput,
  RepaymentInput,
  ProcessLoanInput,
  GetLoansParams,
  LoanListResponse,
  DisburseResult,
} from "../types/loans"

export const loansApi = {
  getMyLoans: async (): Promise<Loan[]> => {
    return authedRequest<Loan[]>("/v1/loans/me")
  },

  apply: async (data: ApplyLoanInput): Promise<Loan> => {
    return authedRequest<Loan>("/v1/loans/apply", {
      method: "POST",
      body: data,
    })
  },

  getById: async (id: string): Promise<Loan> => {
    return authedRequest<Loan>(`/v1/loans/${id}`)
  },

  addRepayment: async (
    id: string,
    data: RepaymentInput,
  ): Promise<Loan> => {
    return authedRequest<Loan>(`/v1/loans/${id}/repayment`, {
      method: "POST",
      body: data,
    })
  },

  list: async (params?: GetLoansParams): Promise<LoanListResponse> => {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())
    if (params?.status) queryParams.append("status", params.status)

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ""

    return authedRequest<LoanListResponse>(`/v1/loans/${query}`)
  },

  process: async (
    id: string,
    data: ProcessLoanInput,
  ): Promise<Loan> => {
    return authedRequest<Loan>(`/v1/loans/${id}/process`, {
      method: "PATCH",
      body: data,
    })
  },

  disburse: async (id: string): Promise<DisburseResult> => {
    return authedRequest<DisburseResult>(`/v1/loans/${id}/disburse`, {
      method: "POST",
    })
  },
}
