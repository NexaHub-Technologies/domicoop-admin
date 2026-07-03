// GET /reports/summary — nested aggregate per the API contract (§11).
// Money units differ per section: contributions.total & transactions.total_revenue
// are KOBO; loans.* and dividends.total_paid are NAIRA (see money.ts).
export interface ReportSummary {
  year: number
  summary: {
    total_members: number
    active_members: number
    pending_members: number
  }
  contributions: {
    total: number // kobo
    count: number
    pending: number
  }
  loans: {
    total_requested: number // naira
    total_approved: number // naira
    total_outstanding: number // naira
    count: number
    active: number
  }
  transactions: {
    total_revenue: number // kobo
    count: number
  }
  dividends: {
    total_paid: number // naira
    count: number
  }
}

export interface GetReportParams {
  year?: number
}
