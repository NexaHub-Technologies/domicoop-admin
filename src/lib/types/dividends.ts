export interface Dividend {
  id: string
  member_id: string
  member_no: string
  member_name: string
  amount: number // naira
  year: number
  status: "pending" | "paid" | "failed"
  paid_at?: string
  created_at: string
}

export interface DividendsListResponse {
  data: Dividend[]
  total: number | null
}

export interface PreviewDividendInput {
  year: number
  total_amount: number // pool to share, in NAIRA
}

// POST /dividends/preview (§7). NOTE the mixed money units:
// `contribution_amount` and `grand_total_contributions` are KOBO (read straight
// from the contributions table); `dividend_amount` is NAIRA.
export interface DividendPreviewEntry {
  member_id: string
  full_name: string
  member_no: string
  contribution_amount: number // kobo
  dividend_amount: number // naira
}

export interface PreviewDividendResponse {
  year: number
  total_amount: number // naira
  total_members: number
  grand_total_contributions: number // kobo
  preview: DividendPreviewEntry[]
}

export interface DistributeDividendInput {
  year: number
  dividends: {
    member_id: string
    amount: number // naira
  }[]
}

// POST /dividends/distribute (§7) — per-member outcome; not transactional.
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
