import { createFileRoute } from "@tanstack/react-router"
import { useState, useMemo, useEffect } from "react"
import { ApiError } from "../../lib/http"
import type {
  Contribution,
  UpdateContributionStatusInput,
} from "../../lib/types/contributions"
import {
  contributionMemberName,
  contributionMemberNo,
} from "../../lib/types/contributions"
import { formatNaira } from "../../lib/money"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  useContributions,
  useUpdateContributionStatus,
} from "../../lib/queries"
import { createColumnHelper } from "@tanstack/react-table"
import { DataTable, dataTableFeatures } from "../../components/data-table"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Download04Icon,
  FilterHorizontalIcon,
  Search01Icon,
  CheckmarkCircle02Icon,
  CancelSquareIcon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons"

export const Route = createFileRoute("/_authenticated/contributions")({
  component: ContributionsPage,
})

type StatusFilter = "all" | "success" | "pending" | "failed" | "abandoned"
type ContributionStatus = UpdateContributionStatusInput["status"]

const PAGE_SIZE = 25

const statusStyles: Record<string, string> = {
  success:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  abandoned:
    "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
}

const helper = createColumnHelper<typeof dataTableFeatures, Contribution>()

function useContributionColumns(onReview: (c: Contribution) => void) {
  return useMemo(
    () =>
      helper.columns([
        helper.accessor((c) => contributionMemberName(c), {
          id: "member",
          header: "Member",
          cell: ({ row }) => (
            <div>
              <p className="text-sm font-bold text-[#191c1e] dark:text-white">
                {contributionMemberName(row.original)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {contributionMemberNo(row.original)}
              </p>
            </div>
          ),
        }),
        helper.accessor("amount", {
          header: "Amount",
          cell: ({ getValue }) => (
            <span className="font-bold text-[#191c1e] dark:text-white">
              {formatNaira(Number(getValue()))}
            </span>
          ),
        }),
        helper.accessor((c) => `${c.month} ${c.year}`, {
          id: "period",
          header: "Period",
          cell: ({ getValue }) => (
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {getValue()}
            </span>
          ),
        }),
        helper.accessor("payment_method", {
          header: "Method",
          cell: ({ getValue }) => (
            <span className="text-sm text-slate-600 capitalize dark:text-slate-400">
              {getValue() ?? "—"}
            </span>
          ),
        }),
        helper.accessor("payment_status", {
          header: "Status",
          cell: ({ getValue }) => (
            <Badge
              variant="outline"
              className={`text-[10px] font-black uppercase ${statusStyles[getValue() as string] ?? ""}`}
            >
              {getValue()}
            </Badge>
          ),
        }),
        helper.display({
          id: "actions",
          header: "",
          cell: ({ row }) => (
            <div className="text-right">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReview(row.original)}
                className="text-xs"
              >
                Review
              </Button>
            </div>
          ),
        }),
      ]),
    [onReview]
  )
}

/**
 * Review a member contribution and confirm its payment outcome.
 *
 * Shows who paid, what period it covers, how the amount splits across the
 * allocation buckets, and the payment trail — then offers the four
 * settlement states. The current status is marked so the admin can see at
 * a glance whether anything still needs doing.
 */
function ReviewContributionDialog({
  contribution: c,
  busy,
  onClose,
  onSetStatus,
}: {
  contribution: Contribution
  busy: boolean
  onClose: () => void
  onSetStatus: (s: ContributionStatus) => void
}) {
  const buckets = [
    { label: "Shares", value: c.shares },
    { label: "Social", value: c.social },
    { label: "Savings", value: c.savings },
    { label: "Deposit", value: c.deposit },
  ]

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Review contribution</DialogTitle>
          <DialogDescription>
            {contributionMemberName(c)} · {contributionMemberNo(c)} ·{" "}
            {c.month} {c.year}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-[#003d9a]/5 p-4 text-center dark:bg-[#b2c5ff]/10">
          <p className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Amount paid
          </p>
          <p className="text-3xl font-extrabold text-[#191c1e] dark:text-white">
            {formatNaira(Number(c.amount))}
          </p>
          <div className="mt-2 flex justify-center">
            <Badge
              variant="outline"
              className={`text-[10px] font-black uppercase ${statusStyles[c.payment_status] ?? ""}`}
            >
              {c.payment_status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Method
            </p>
            <p className="text-[#191c1e] capitalize dark:text-white">
              {c.payment_method ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Paid on
            </p>
            <p className="text-[#191c1e] dark:text-white">
              {new Date(c.created_at).toLocaleDateString()}
            </p>
          </div>
          {c.member_email && (
            <div className="col-span-2">
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Payer email
              </p>
              <p className="text-[#191c1e] break-all dark:text-white">
                {c.member_email}
              </p>
            </div>
          )}
          {c.transaction_ref && (
            <div className="col-span-2">
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Transaction ref
              </p>
              <p className="font-mono text-xs break-all text-slate-600 dark:text-slate-300">
                {c.transaction_ref}
              </p>
            </div>
          )}
          {c.notes && (
            <div className="col-span-2">
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Notes
              </p>
              <p className="text-[#191c1e] dark:text-white">{c.notes}</p>
            </div>
          )}
        </div>

        {buckets.some((b) => b.value != null) && (
          <div>
            <p className="mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Allocation
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {buckets.map((b) => (
                <div
                  key={b.label}
                  className="rounded-lg border border-slate-100 p-2 text-center dark:border-slate-800"
                >
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">
                    {b.label}
                  </p>
                  <p className="text-sm font-bold text-[#191c1e] dark:text-white">
                    {b.value != null ? formatNaira(Number(b.value)) : "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Set status
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                "success",
                "pending",
                "failed",
                "abandoned",
              ] as ContributionStatus[]
            ).map((s) => (
              <button
                key={s}
                onClick={() => onSetStatus(s)}
                disabled={busy || c.payment_status === s}
                className={`rounded-lg py-2 text-sm font-semibold capitalize transition-colors disabled:opacity-50 ${
                  s === "success"
                    ? "bg-green-600 text-white hover:brightness-110"
                    : s === "failed"
                      ? "bg-red-600 text-white hover:brightness-110"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                } ${c.payment_status === s ? "ring-2 ring-offset-1 ring-[#003d9a]/40" : ""}`}
              >
                {busy ? "Saving…" : s}
              </button>
            ))}
          </div>
          {c.payment_status !== "pending" && c.payment_status !== "failed" && (
            <p className="mt-2 text-xs text-slate-400">
              Current status is {c.payment_status} — changing it should be
              deliberate.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ContributionsPage() {
  const [status, setStatus] = useState<StatusFilter>("all")
  const [year, setYear] = useState<number | "">("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [reviewing, setReviewing] = useState<Contribution | null>(null)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const contributionsQuery = useContributions(
    page,
    PAGE_SIZE,
    year === "" ? undefined : year
  )
  const allRows = contributionsQuery.data?.data ?? []
  // The status filter stays client-side over the page, as it was; the year is
  // a server parameter and so lives in the query key.
  const rows =
    status === "all"
      ? allRows
      : allRows.filter((c: Contribution) => c.payment_status === status)
  const total = contributionsQuery.data?.total ?? null
  const loading = contributionsQuery.isPending
  const error = contributionsQuery.error
    ? contributionsQuery.error instanceof Error
      ? contributionsQuery.error.message
      : "Failed to load contributions"
    : null

  const updateStatus = useUpdateContributionStatus()
  const isPending = (id: string) =>
    updateStatus.isPending && updateStatus.variables?.id === id

  // status/year filters reset to page 1
  useEffect(() => {
    setPage(1)
  }, [status, year])

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter(
      (c) =>
        contributionMemberName(c).toLowerCase().includes(q) ||
        contributionMemberNo(c).toLowerCase().includes(q)
    )
  }, [rows, search])

  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1
  const columns = useContributionColumns((c) => setReviewing(c))

  // The badge changes the moment the choice is made, and Query restores the
  // previous status if the server refuses — the table never keeps showing a
  // state that was rejected.
  const handleUpdateStatus = (id: string, newStatus: ContributionStatus) =>
    updateStatus.mutate(
      { id, status: newStatus },
      {
        onSuccess: () => {
          setReviewing(null)
          showToast(`Contribution marked ${newStatus}.`, "success")
        },
        onError: (err) =>
          showToast(
            err instanceof ApiError ? err.message : "Failed to update status",
            "error"
          ),
      }
    )

  const exportCSV = () => {
    const headers = [
      "Member No",
      "Member",
      "Amount (NGN)",
      "Month",
      "Year",
      "Status",
    ]
    const lines = filtered.map((c) =>
      [
        contributionMemberNo(c),
        contributionMemberName(c),
        // contributions.amount is NAIRA, normalised in 20260705075811 — the
        // /100 that used to be here exported ₦5,000 as "50.00" while the table
        // beside it rendered ₦5,000.00.
        c.amount.toFixed(2),
        c.month,
        c.year,
        c.payment_status,
      ]
        .map((v) => `"${v}"`)
        .join(",")
    )
    const blob = new Blob([[headers.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8;",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "contributions.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  )

  return (
    <div className="space-y-6 sm:space-y-8">
      {toast && (
        <div
          className={`fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-5 w-5" />
          ) : (
            <HugeiconsIcon icon={CancelSquareIcon} className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-2 block text-xs font-bold tracking-[0.2em] text-[#003d9a] uppercase dark:text-[#b2c5ff]">
            Financial Processing
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#191c1e] sm:text-3xl dark:text-white">
            Contributions
          </h2>
          <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
            Review member contributions and confirm payment outcomes.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={exportCSV}
          className="self-start sm:self-auto"
        >
          <HugeiconsIcon icon={Download04Icon} className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <HugeiconsIcon icon={FilterHorizontalIcon} className="h-4 w-4" />
            <span>Status:</span>
          </div>
          {(
            [
              "all",
              "success",
              "pending",
              "failed",
              "abandoned",
            ] as StatusFilter[]
          ).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all sm:text-sm ${
                status === s
                  ? "bg-[#003d9a] text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {s}
            </button>
          ))}
          <select
            value={year}
            onChange={(e) =>
              setYear(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <div className="relative ml-auto">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search member…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-9 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <DataTable
              columns={columns}
              data={filtered}
              loading={loading}
              error={error}
              emptyMessage="No contributions found"
              rowClassName={(c) => (isPending(c.id) ? "opacity-50" : "")}
              skeletonWidths={[
                "h-8 w-36",
                "h-4 w-20",
                "h-4 w-24",
                "h-4 w-16",
                "h-5 w-16",
                "h-8 w-20",
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Page {page}
          {total !== null ? ` of ${totalPages} · ${total} total` : ""}
        </p>
        <div className="flex gap-2">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            variant="outline"
            size="sm"
            disabled={page === 1 || loading}
            className="text-xs sm:text-sm"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={() => setPage((p) => p + 1)}
            variant="outline"
            size="sm"
            disabled={page >= totalPages || loading}
            className="text-xs sm:text-sm"
          >
            Next
            <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Review dialog */}
      {reviewing && (
        <ReviewContributionDialog
          contribution={reviewing}
          busy={isPending(reviewing.id)}
          onClose={() => setReviewing(null)}
          onSetStatus={(s) => handleUpdateStatus(reviewing.id, s)}
        />
      )}
    </div>
  )
}
