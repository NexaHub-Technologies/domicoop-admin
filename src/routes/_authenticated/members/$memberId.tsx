import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState, useEffect, useCallback } from "react"
import { membersApi } from "../../../lib/api/members"
import type { Member } from "../../../lib/types/auth"
import type { MemberStatement, StatementEntry } from "../../../lib/types/members"
import { formatNaira } from "../../../lib/money"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  UserRemove01Icon,
  MoneySend01Icon,
  BankIcon,
  Gif01Icon,
} from "@hugeicons/core-free-icons"

export const Route = createFileRoute("/_authenticated/members/$memberId")({
  component: MemberDetailPage,
})

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Statement amounts are all in naira.
function formatEntryAmount(entry: StatementEntry): string {
  return formatNaira(entry.amount)
}

const entryIcon: Record<StatementEntry["type"], typeof MoneySend01Icon> = {
  contribution: MoneySend01Icon,
  repayment: MoneySend01Icon,
  loan: BankIcon,
  dividend: Gif01Icon,
}

function MemberDetailPage() {
  const { memberId } = Route.useParams()
  const navigate = useNavigate()

  const [member, setMember] = useState<Member | null>(null)
  const [statement, setStatement] = useState<MemberStatement | null>(null)
  const [year, setYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    setNotFound(false)
    try {
      const [memberData, statementData] = await Promise.all([
        membersApi.getById(memberId),
        membersApi.getStatement(memberId, { year }),
      ])
      setMember(memberData)
      setStatement(statementData)
    } catch (err) {
      const status = (err as { status?: number }).status
      if (status === 404) setNotFound(true)
      else setError(err instanceof Error ? err.message : "Failed to load member")
    } finally {
      setLoading(false)
    }
  }, [memberId, year])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-slate-500">
        Loading member…
      </div>
    )
  }

  if (notFound || !member) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <HugeiconsIcon
          icon={UserRemove01Icon}
          className="mb-4 h-16 w-16 text-slate-300 dark:text-slate-600"
        />
        <h2 className="mb-2 text-2xl font-bold text-[#191c1e] dark:text-white">
          Member Not Found
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {error ?? "The member you are looking for does not exist."}
        </p>
      </div>
    )
  }

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="space-y-8">
      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate({ to: "/members" })}
          className="p-2 text-slate-500 transition-colors hover:text-[#1e55be] dark:text-slate-400 dark:hover:text-[#b2c5ff]"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="h-6 w-6" />
        </button>
        <div>
          <span className="mb-1 block text-xs font-bold tracking-[0.2em] text-[#003d9a] uppercase dark:text-[#b2c5ff]">
            Member Details
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#191c1e] dark:text-white">
            {member.full_name}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#1e55be] to-[#003d9a] text-3xl font-bold text-white">
              {getInitials(member.full_name)}
            </div>
            <h3 className="text-xl font-bold text-[#191c1e] dark:text-white">
              {member.full_name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {member.email}
            </p>
            <span
              className={`mt-3 inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase ${
                member.status === "active"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : member.status === "pending"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
              }`}
            >
              {member.status}
            </span>
          </div>

          <div className="space-y-1">
            <DetailRow label="Member No" value={member.member_no || "—"} bold />
            <DetailRow label="Phone" value={member.phone || "—"} />
            <DetailRow label="Address" value={member.address || "—"} />
            <DetailRow label="Next of Kin" value={member.next_of_kin || "—"} />
            <DetailRow
              label="Joined"
              value={new Date(member.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            />
          </div>
        </div>

        {/* Right Column - Stats & Activity */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              label="Total Contributions"
              value={formatNaira(statement?.summary.total_contributions ?? 0)}
            />
            <StatCard
              label="Total Loans"
              value={formatNaira(statement?.summary.total_loans ?? 0)}
            />
            <StatCard
              label="Dividends Earned"
              value={formatNaira(statement?.summary.total_dividends ?? 0)}
            />
          </div>

          {/* Statement / Activity */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#191c1e] dark:text-white">
                Statement — {year}
              </h3>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            {statement && statement.transactions.length > 0 ? (
              <div className="space-y-4">
                {statement.transactions.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e55be]/10 dark:bg-[#1e55be]/20">
                      <HugeiconsIcon
                        icon={entryIcon[entry.type]}
                        className="h-5 w-5 text-[#1e55be] dark:text-[#b2c5ff]"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[#191c1e] dark:text-white">
                        {entry.description}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {formatEntryAmount(entry)} · {entry.status}
                      </p>
                    </div>
                    <span className="text-sm text-slate-400">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-slate-500 dark:text-slate-400">
                No activity recorded for {year}.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-3 dark:border-slate-700">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span
        className={`text-right ${bold ? "font-bold" : "font-medium"} text-[#191c1e] dark:text-white`}
      >
        {value}
      </span>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
      <p className="mb-1 text-xs tracking-wider text-slate-500 uppercase dark:text-slate-400">
        {label}
      </p>
      <p className="text-2xl font-bold text-[#191c1e] dark:text-white">
        {value}
      </p>
    </div>
  )
}
