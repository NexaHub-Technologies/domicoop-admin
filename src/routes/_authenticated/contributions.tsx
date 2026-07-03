import { createFileRoute } from "@tanstack/react-router"
import { useState, useMemo, useEffect, useCallback } from "react"
import { contributionsApi } from "../../lib/api/contributions"
import { ApiError } from "../../lib/http"
import type {
  Contribution,
  UpdateContributionStatusInput,
} from "../../lib/types/contributions"
import { formatKobo } from "../../lib/money"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  abandoned: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
}

function ContributionsPage() {
  const [rows, setRows] = useState<Contribution[]>([])
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await contributionsApi.list({
        page,
        limit: PAGE_SIZE,
        status: status === "all" ? undefined : status,
        year: year === "" ? undefined : year,
      })
      setRows(res.data)
      setTotal(res.total)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load contributions",
      )
    } finally {
      setLoading(false)
    }
  }, [page, status, year])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // status/year filters reset to page 1
  useEffect(() => {
    setPage(1)
  }, [status, year])

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter(
      (c) =>
        c.member_name?.toLowerCase().includes(q) ||
        (c.member_no ?? "").toLowerCase().includes(q),
    )
  }, [rows, search])

  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1

  const handleUpdateStatus = async (
    id: string,
    newStatus: ContributionStatus,
  ) => {
    try {
      await contributionsApi.updateStatus(id, { status: newStatus })
      showToast(`Contribution marked ${newStatus}.`, "success")
      setReviewing(null)
      fetchData()
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Failed to update status",
        "error",
      )
    }
  }

  const exportCSV = () => {
    const headers = ["Member No", "Member", "Amount (NGN)", "Month", "Year", "Status"]
    const lines = filtered.map((c) =>
      [
        c.member_no ?? "",
        c.member_name ?? "",
        (c.amount / 100).toFixed(2),
        c.month,
        c.year,
        c.status,
      ]
        .map((v) => `"${v}"`)
        .join(","),
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

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

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
            ["all", "success", "pending", "failed", "abandoned"] as StatusFilter[]
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
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 dark:bg-slate-800/50 dark:hover:bg-slate-800/50">
                  <TableHead className="text-[10px] font-black tracking-widest uppercase">
                    Member
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest uppercase">
                    Amount
                  </TableHead>
                  <TableHead className="hidden text-[10px] font-black tracking-widest uppercase sm:table-cell">
                    Period
                  </TableHead>
                  <TableHead className="hidden text-[10px] font-black tracking-widest uppercase md:table-cell">
                    Method
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest uppercase">
                    Status
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-black tracking-widest uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-slate-500">
                      Loading contributions…
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-slate-500">
                      No contributions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((c) => (
                    <TableRow
                      key={c.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <TableCell>
                        <p className="text-sm font-bold text-[#191c1e] dark:text-white">
                          {c.member_name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {c.member_no}
                        </p>
                      </TableCell>
                      <TableCell className="font-bold text-[#191c1e] dark:text-white">
                        {formatKobo(c.amount)}
                      </TableCell>
                      <TableCell className="hidden text-sm text-slate-600 sm:table-cell dark:text-slate-400">
                        {c.month} {c.year}
                      </TableCell>
                      <TableCell className="hidden text-sm text-slate-600 capitalize md:table-cell dark:text-slate-400">
                        {c.payment_method ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-black uppercase ${statusStyles[c.status] ?? ""}`}
                        >
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setReviewing(c)}
                          className="text-xs"
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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

      {/* Review modal */}
      {reviewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-[#0b1326]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#191c1e] dark:text-white">
                Review Contribution
              </h3>
              <button
                onClick={() => setReviewing(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <HugeiconsIcon icon={CancelSquareIcon} className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4 space-y-1 text-sm">
              <p className="font-bold text-[#191c1e] dark:text-white">
                {reviewing.member_name} · {reviewing.member_no}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                {formatKobo(reviewing.amount)} · {reviewing.month}{" "}
                {reviewing.year}
              </p>
              {reviewing.transaction_ref && (
                <p className="text-xs text-slate-400">
                  Ref: {reviewing.transaction_ref}
                </p>
              )}
            </div>
            <p className="mb-2 text-xs font-semibold text-slate-500">
              Set status
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(
                ["success", "pending", "failed", "abandoned"] as ContributionStatus[]
              ).map((s) => (
                <button
                  key={s}
                  onClick={() => handleUpdateStatus(reviewing.id, s)}
                  className={`rounded-lg py-2 text-sm font-semibold capitalize transition-colors ${
                    s === "success"
                      ? "bg-green-600 text-white hover:brightness-110"
                      : s === "failed"
                        ? "bg-red-600 text-white hover:brightness-110"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
