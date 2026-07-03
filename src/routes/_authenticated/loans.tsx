import { createFileRoute } from "@tanstack/react-router"
import { useState, useMemo, useEffect, useCallback } from "react"
import { loansApi } from "../../lib/api/loans"
import { ApiError } from "../../lib/http"
import type { Loan, ProcessLoanInput } from "../../lib/types/loans"
import { formatNaira } from "../../lib/money"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BankIcon,
  MoneySend01Icon,
  Task01Icon,
  CheckmarkCircle02Icon,
  CancelSquareIcon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons"

export const Route = createFileRoute("/_authenticated/loans")({
  component: LoansPage,
})

type StatusFilter =
  | "all"
  | "pending"
  | "under_review"
  | "approved"
  | "disbursed"
  | "rejected"

const PAGE_SIZE = 25

const statusStyles: Record<string, string> = {
  approved:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  disbursed:
    "bg-[#1e55be]/10 text-[#1e55be] dark:bg-[#b2c5ff]/20 dark:text-[#b2c5ff]",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  under_review:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  repaid: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
}

function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filter, setFilter] = useState<StatusFilter>("all")
  const [page, setPage] = useState(1)
  const [processing, setProcessing] = useState<Loan | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await loansApi.list({
        page,
        limit: PAGE_SIZE,
        status: filter === "all" ? undefined : filter,
      })
      setLoans(res.data)
      setTotal(res.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load loans")
    } finally {
      setLoading(false)
    }
  }, [page, filter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    setPage(1)
  }, [filter])

  const stats = useMemo(() => {
    const active = loans.filter(
      (l) => l.status === "approved" || l.status === "disbursed",
    )
    const activeTotal = active.reduce(
      (sum, l) => sum + (l.amount_approved ?? l.amount),
      0,
    )
    const disbursedTotal = loans
      .filter((l) => l.status === "disbursed")
      .reduce((sum, l) => sum + (l.amount_approved ?? l.amount), 0)
    const pending = loans.filter(
      (l) => l.status === "pending" || l.status === "under_review",
    ).length
    return { activeTotal, disbursedTotal, pending }
  }, [loans])

  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1

  const handleProcess = async (id: string, data: ProcessLoanInput) => {
    try {
      await loansApi.process(id, data)
      showToast(`Loan ${data.status.replace("_", " ")}.`, "success")
      setProcessing(null)
      fetchData()
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Failed to process loan",
        "error",
      )
    }
  }

  const handleQuickProcess = async (
    id: string,
    status: ProcessLoanInput["status"],
  ) => {
    await handleProcess(id, { status })
  }

  const handleDisburse = async (id: string) => {
    setBusyId(id)
    try {
      const res = await loansApi.disburse(id)
      if (res.status === "disbursed") {
        showToast("Loan disbursed successfully.", "success")
      } else if (res.status === "pending_otp") {
        showToast(
          "Disbursement initiated — awaiting Paystack OTP. Reconciles via webhook.",
          "success",
        )
      } else {
        showToast(res.message || "Disbursement failed.", "error")
      }
      fetchData()
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Failed to disburse loan",
        "error",
      )
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {toast && (
        <div
          className={`fixed right-4 bottom-4 z-50 flex max-w-sm items-center gap-2 rounded-lg px-4 py-3 shadow-lg ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-5 w-5 shrink-0" />
          ) : (
            <HugeiconsIcon icon={CancelSquareIcon} className="h-5 w-5 shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-2 block text-xs font-bold tracking-[0.2em] text-[#003d9a] uppercase dark:text-[#b2c5ff]">
            Credit Management
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#191c1e] sm:text-3xl dark:text-white">
            Loan Management
          </h2>
        </div>
      </div>

      {/* Hero Stats (current view) */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <StatCard
          icon={BankIcon}
          iconClass="text-[#1e55be] dark:text-[#b2c5ff]"
          label="Active Loans (page)"
          value={formatNaira(stats.activeTotal, true)}
        />
        <StatCard
          icon={MoneySend01Icon}
          iconClass="text-green-600"
          label="Disbursed (page)"
          value={formatNaira(stats.disbursedTotal, true)}
        />
        <StatCard
          icon={Task01Icon}
          iconClass="text-amber-600"
          label="Pending (page)"
          value={String(stats.pending)}
        />
      </section>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            "all",
            "pending",
            "under_review",
            "approved",
            "disbursed",
            "rejected",
          ] as StatusFilter[]
        ).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all sm:text-sm ${
              filter === s
                ? "bg-[#003d9a] text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Loan Queue */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Loan Approval Queue
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 dark:bg-slate-800/50 dark:hover:bg-slate-800/50">
                  <TableHead className="text-[10px] font-black tracking-widest uppercase">
                    Borrower
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest uppercase">
                    Amount
                  </TableHead>
                  <TableHead className="hidden text-[10px] font-black tracking-widest uppercase sm:table-cell">
                    Purpose
                  </TableHead>
                  <TableHead className="hidden text-[10px] font-black tracking-widest uppercase md:table-cell">
                    Tenure
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
                      Loading loans…
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : loans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-slate-500">
                      No loans found
                    </TableCell>
                  </TableRow>
                ) : (
                  loans.map((loan) => (
                    <TableRow
                      key={loan.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <TableCell>
                        <p className="text-sm font-bold text-[#191c1e] dark:text-white">
                          {loan.member_name}
                        </p>
                        <p className="text-xs text-slate-500 capitalize dark:text-slate-400">
                          {loan.member_no} · {loan.type}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-[#191c1e] dark:text-white">
                        {formatNaira(loan.amount_approved ?? loan.amount)}
                        {loan.amount_approved != null &&
                          loan.amount_approved !== loan.amount && (
                            <span className="block text-xs text-slate-400">
                              req {formatNaira(loan.amount)}
                            </span>
                          )}
                      </TableCell>
                      <TableCell className="hidden max-w-[200px] truncate text-sm text-slate-600 sm:table-cell dark:text-slate-400">
                        {loan.purpose}
                      </TableCell>
                      <TableCell className="hidden text-sm text-slate-600 md:table-cell dark:text-slate-400">
                        {loan.tenure_months} mo
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-black uppercase ${statusStyles[loan.status] ?? ""}`}
                        >
                          {loan.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          {(loan.status === "pending" ||
                            loan.status === "under_review") && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => setProcessing(loan)}
                                className="bg-[#003d9a] px-2 text-xs hover:bg-[#002d7a] sm:px-3"
                              >
                                Review
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleQuickProcess(loan.id, "rejected")
                                }
                                className="px-2 text-xs sm:px-3"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {loan.status === "approved" && (
                            <Button
                              size="sm"
                              onClick={() => handleDisburse(loan.id)}
                              disabled={busyId === loan.id}
                              className="bg-green-600 px-2 text-xs hover:bg-green-700 sm:px-3"
                            >
                              {busyId === loan.id ? "Disbursing…" : "Disburse"}
                            </Button>
                          )}
                        </div>
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

      {processing && (
        <ProcessLoanModal
          loan={processing}
          onClose={() => setProcessing(null)}
          onSubmit={(data) => handleProcess(processing.id, data)}
        />
      )}
    </div>
  )
}

function StatCard({
  icon,
  iconClass,
  label,
  value,
}: {
  icon: typeof BankIcon
  iconClass: string
  label: string
  value: string
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <HugeiconsIcon icon={icon} className={`mb-3 h-7 w-7 ${iconClass}`} />
        <p className="mb-1 text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
          {label}
        </p>
        <h3 className="text-2xl font-bold text-[#191c1e] sm:text-3xl dark:text-white">
          {value}
        </h3>
      </CardContent>
    </Card>
  )
}

// PATCH /loans/:id/process — approve requires amount_approved, tenure_months.
function ProcessLoanModal({
  loan,
  onClose,
  onSubmit,
}: {
  loan: Loan
  onClose: () => void
  onSubmit: (data: ProcessLoanInput) => void
}) {
  const [amountApproved, setAmountApproved] = useState<number>(loan.amount)
  const [interestRate, setInterestRate] = useState<number>(
    loan.interest_rate ?? 5,
  )
  const [tenureMonths, setTenureMonths] = useState<number>(loan.tenure_months)
  const [adminNotes, setAdminNotes] = useState("")

  const approve = () =>
    onSubmit({
      status: "approved",
      amount_approved: amountApproved,
      interest_rate: interestRate,
      tenure_months: tenureMonths,
      admin_notes: adminNotes || undefined,
    })

  const inputCls =
    "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-[#0b1326]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#191c1e] dark:text-white">
            Process Loan — {loan.member_name}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <HugeiconsIcon icon={CancelSquareIcon} className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          Requested {formatNaira(loan.amount)} · {loan.purpose}
        </p>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Amount Approved (₦)
            </label>
            <input
              type="number"
              value={amountApproved}
              onChange={(e) => setAmountApproved(Number(e.target.value))}
              min={0}
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Interest Rate (%)
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                min={0}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Tenure (months)
              </label>
              <input
                type="number"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                min={1}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Admin Notes
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              className={inputCls}
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={() =>
                onSubmit({ status: "under_review", admin_notes: adminNotes || undefined })
              }
              className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Mark Under Review
            </button>
            <button
              type="button"
              onClick={() =>
                onSubmit({ status: "rejected", admin_notes: adminNotes || undefined })
              }
              className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-bold text-white hover:brightness-110"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={approve}
              className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-bold text-white hover:brightness-110"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
