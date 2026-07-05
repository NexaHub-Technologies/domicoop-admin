export interface Dividend {
  id: string
  member_id: string
  amount: number // naira
  year: number
  paystack_transfer_ref: string | null
  status: "processing" | "success" | "failed"
  created_at: string
  profiles: {
    full_name: string
    member_no: string | null
  }
}

export interface DividendsListResponse {
  data: Dividend[]
  total: null
}

export interface PreviewDividendInput {
  year: number
  total_amount: number // pool to share, in NAIRA
}

// POST /dividends/preview.
export interface DividendPreviewEntry {
  member_id: string
  full_name: string
  member_no: string
  contribution_amount: number // naira
  dividend_amount: number // naira
}

export interface PreviewDividendResponse {
  year: number
  total_amount: number // naira
  total_members: number
  grand_total_contributions: number // naira
  preview: DividendPreviewEntry[]
}

export interface DistributeDividendInput {
  year: number
  dividends: {
    member_id: string
    amount: number // naira
  }[]
}

// POST /dividends/distribute — per-member outcome; not transactional.
export interface DistributeResultEntry {
  member_id: string
  status: "processing" | "failed"
  transfer_code?: string
  error?: string
}

export interface DistributeDividendResponse {
  results: DistributeResultEntry[]
}

export interface GetDividendsParams {
  year?: number
}
