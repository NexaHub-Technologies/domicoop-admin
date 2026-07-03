export type LoanType = "emergency" | "personal" | "housing" | "education" | "business"
export type LoanStatus = "pending" | "under_review" | "approved" | "rejected" | "disbursed" | "repaid"
export type ProcessStatus = "approved" | "rejected" | "under_review" | "disbursed"

export interface Loan {
  id: string
  member_id: string
  member_no: string
  member_name: string
  amount: number
  amount_approved?: number
  purpose: string
  type: LoanType
  status: LoanStatus
  tenure_months: number
  interest_rate?: number
  monthly_repayment?: number
  total_repayable?: number
  amount_paid?: number
  balance?: number
  admin_notes?: string
  applied_at: string
  processed_at?: string
  disbursed_at?: string
  created_at: string
  updated_at: string
}

export interface ApplyLoanInput {
  amount: number
  purpose: string
  type: LoanType
  tenure_months: number
}

export interface RepaymentInput {
  reference: string
  amount: number
  channel: string
  customer: {
    email: string
    first_name?: string
    last_name?: string
  }
  metadata?: Record<string, unknown>
}

export interface ProcessLoanInput {
  status: ProcessStatus
  amount_approved?: number
  interest_rate?: number
  tenure_months?: number
  admin_notes?: string
}

export interface GetLoansParams {
  page?: number
  limit?: number
  status?: string
}

export interface LoanListResponse {
  data: Loan[]
  total: number | null
}

// POST /loans/:id/disburse returns a transfer-status object, not a Loan row.
// The authoritative outcome arrives later via the Paystack webhook (§6).
export type DisburseStatus =
  | "disbursed"
  | "pending_otp"
  | "disbursement_failed"

export interface DisburseResult {
  success: boolean
  status: DisburseStatus
  paystack_transfer_ref?: string
  disbursed_at?: string
  message: string
}
