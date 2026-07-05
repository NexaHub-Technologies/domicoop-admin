const NGN = new Intl.NumberFormat("en-NG", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const NGN_WHOLE = new Intl.NumberFormat("en-NG", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/** Format an amount in NAIRA. */
export function formatNaira(amount: number, whole = false): string {
  return `₦${(whole ? NGN_WHOLE : NGN).format(amount ?? 0)}`
}
