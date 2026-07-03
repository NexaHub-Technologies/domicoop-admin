export interface Contribution {
  id: string
  member_id: string
  member_no: string
  member_name: string
  amount: number
  year: number
  month: string
  transaction_ref?: string
  payment_method?: string
  payment_status?: string
  status: "success" | "pending" | "failed" | "abandoned"
  notes?: string
  member_email?: string
  created_at: string
  updated_at: string
}

export interface GetContributionsParams {
  page?: number
  limit?: number
  year?: number
  month?: string
  status?: string
  member_id?: string
}

export interface ContributionListResponse {
  data: Contribution[]
  total: number | null
}

export interface CreateContributionInput {
  amount: number
  year: number
  month: string
  transaction_ref?: string
  member_no?: string
  member_email?: string
  payment_method?: string
  payment_status?: string
  notes?: string
}

export interface UpdateContributionStatusInput {
  status: "success" | "failed" | "abandoned" | "pending"
}
