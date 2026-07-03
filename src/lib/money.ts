// Money units are inconsistent across resources (contract §1) — this is a real
// backend inconsistency, not a doc simplification. Use the unit-named helper
// that matches the field's source; never "normalize" blindly.
//
//   KOBO  (÷100 for display): contributions & transactions amounts,
//          reports.contributions.total, reports.transactions.total_revenue,
//          dividend-preview contribution_amount & grand_total_contributions.
//   NAIRA (no division):       loans (amount_*, balance, monthly_repayment),
//          /dividends amounts, reports.loans.*, reports.dividends.total_paid,
//          dividend-preview dividend_amount.

const NGN = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
})

const NGN_WHOLE = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
})

/** Format an amount stored in KOBO (divides by 100). */
export function formatKobo(amountKobo: number, whole = false): string {
  const naira = (amountKobo ?? 0) / 100
  return (whole ? NGN_WHOLE : NGN).format(naira)
}

/** Format an amount already in NAIRA (no division). */
export function formatNaira(amountNaira: number, whole = false): string {
  return (whole ? NGN_WHOLE : NGN).format(amountNaira ?? 0)
}

/** Raw naira number from a kobo value, for charts/aggregation. */
export function koboToNaira(amountKobo: number): number {
  return (amountKobo ?? 0) / 100
}
