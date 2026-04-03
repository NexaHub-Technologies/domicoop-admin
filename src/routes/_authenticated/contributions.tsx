import { createFileRoute } from "@tanstack/react-router"
import {
  mockLoans,
  mockMembers,
  mockRecentContributions,
  mockSystemSettings,
} from "../../lib/mock-data"
import { useState } from "react"

export const Route = createFileRoute("/_authenticated/contributions")({
  component: ContributionsPage,
})

function ContributionsPage() {
  const [dividendMode, setDividendMode] = useState<
    "proportional" | "equal" | "tenure"
  >("proportional")
  const pendingLoans = mockLoans.filter((loan) => loan.status === "pending")

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <span className="mb-2 block text-xs font-bold tracking-[0.2em] text-[#003d9a] uppercase dark:text-[#b2c5ff]">
            Financial Processing
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-[#191c1e] dark:text-white">
            Contributions & Dividends
          </h2>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#191c1e] shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-[#0b1326] dark:text-white dark:hover:bg-slate-800">
            <span className="material-symbols-outlined text-sm">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        {/* Left Column: Loan Approval Queue */}
        <div className="space-y-8">
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
            <div className="border-b border-slate-50 px-8 py-6 dark:border-slate-700">
              <h4 className="text-xl font-bold text-[#191c1e] dark:text-white">
                Loan Approval Queue
              </h4>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Review and approve pending loan applications
              </p>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-700">
              {pendingLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="p-6 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="mb-1 text-xs font-bold text-[#003d9a] dark:text-[#b2c5ff]">
                        REQ #{loan.id}
                      </p>
                      <h5 className="text-lg font-bold text-[#191c1e] dark:text-white">
                        ${loan.amount.toLocaleString()}.00
                      </h5>
                      <p className="text-sm text-slate-500 capitalize dark:text-slate-400">
                        {loan.type} Loan
                      </p>
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                        loan.riskProfile === "low"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : loan.riskProfile === "medium"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {loan.riskProfile} Risk
                    </div>
                  </div>

                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                      {loan.borrowerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#191c1e] dark:text-white">
                        {loan.borrowerName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Credit Score: {loan.creditScore}
                      </p>
                    </div>
                  </div>

                  <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-medium">Purpose:</span> {loan.purpose}
                  </p>

                  <div className="flex gap-2">
                    <button className="flex-1 rounded-lg bg-[#003d9a] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#002d7a]">
                      Approve
                    </button>
                    <button className="flex-1 rounded-lg bg-slate-100 py-2.5 text-sm font-bold text-[#191c1e] transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
                      Review
                    </button>
                    <button className="flex-1 rounded-lg bg-red-50 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Contributions */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
            <h4 className="mb-4 text-lg font-bold text-[#191c1e] dark:text-white">
              Recent Contributions
            </h4>
            <div className="space-y-4">
              {mockRecentContributions.map((contribution) => (
                <div
                  key={contribution.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e55be]/10 dark:bg-[#1e55be]/20">
                      <span className="material-symbols-outlined text-sm text-[#1e55be] dark:text-[#b2c5ff]">
                        payments
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#191c1e] dark:text-white">
                        {contribution.memberName}
                      </p>
                      <p className="text-xs text-slate-500 capitalize dark:text-slate-400">
                        {contribution.type} Contribution
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">
                      +${contribution.amount}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(contribution.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dividend Engine */}
        <div className="space-y-8">
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
            <div className="mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1e55be] dark:text-[#b2c5ff]">
                calculate
              </span>
              <h4 className="text-xl font-bold text-[#191c1e] dark:text-white">
                Dividend Engine
              </h4>
            </div>
            <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
              Calculate and distribute surplus to members based on selected
              criteria
            </p>

            {/* Calculation Modes */}
            <div className="mb-6 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-200 p-4 transition-colors hover:border-[#1e55be]/50 has-[:checked]:border-[#1e55be] has-[:checked]:bg-[#1e55be]/5 dark:border-slate-700 dark:has-[:checked]:bg-[#1e55be]/10">
                <input
                  type="radio"
                  name="dividendMode"
                  value="proportional"
                  checked={dividendMode === "proportional"}
                  onChange={() => setDividendMode("proportional")}
                  className="h-4 w-4 text-[#1e55be]"
                />
                <div>
                  <p className="font-bold text-[#191c1e] dark:text-white">
                    Proportional to Contributions
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Distribute based on member contribution history
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-200 p-4 transition-colors hover:border-[#1e55be]/50 has-[:checked]:border-[#1e55be] has-[:checked]:bg-[#1e55be]/5 dark:border-slate-700 dark:has-[:checked]:bg-[#1e55be]/10">
                <input
                  type="radio"
                  name="dividendMode"
                  value="equal"
                  checked={dividendMode === "equal"}
                  onChange={() => setDividendMode("equal")}
                  className="h-4 w-4 text-[#1e55be]"
                />
                <div>
                  <p className="font-bold text-[#191c1e] dark:text-white">
                    Equal Distribution
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Equal amount for all active members
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-200 p-4 transition-colors hover:border-[#1e55be]/50 has-[:checked]:border-[#1e55be] has-[:checked]:bg-[#1e55be]/5 dark:border-slate-700 dark:has-[:checked]:bg-[#1e55be]/10">
                <input
                  type="radio"
                  name="dividendMode"
                  value="tenure"
                  checked={dividendMode === "tenure"}
                  onChange={() => setDividendMode("tenure")}
                  className="h-4 w-4 text-[#1e55be]"
                />
                <div>
                  <p className="font-bold text-[#191c1e] dark:text-white">
                    Tenure Based Bonus
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Reward long-standing members
                  </p>
                </div>
              </label>
            </div>

            {/* Total Amount Input */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Total Dividend Pool
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-4 -translate-y-1/2 font-bold text-slate-500">
                  $
                </span>
                <input
                  type="number"
                  defaultValue="50000"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pr-4 pl-10 font-bold text-[#191c1e] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Calculate Button */}
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#1e55be] to-[#003d9a] py-3 font-bold text-white shadow-lg transition-all active:scale-95">
              <span className="material-symbols-outlined">calculate</span>
              Calculate Distribution
            </button>
          </div>

          {/* Payables Preview */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-bold text-[#191c1e] dark:text-white">
                Payables Preview
              </h4>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                1,284 members
              </span>
            </div>
            <div className="max-h-64 space-y-3 overflow-y-auto">
              {mockMembers.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                      {member.initials}
                    </div>
                    <p className="text-sm font-medium text-[#191c1e] dark:text-white">
                      {member.name}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-green-600">
                    +$
                    {dividendMode === "proportional"
                      ? Math.round(
                          (member.contributions / 100000) * 500
                        ).toLocaleString()
                      : dividendMode === "equal"
                        ? "39"
                        : Math.round(30 + Math.random() * 40).toString()}
                  </p>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-lg border border-[#1e55be] py-3 font-bold text-[#1e55be] transition-colors hover:bg-[#1e55be]/5 dark:border-[#b2c5ff] dark:text-[#b2c5ff] dark:hover:bg-[#1e55be]/10">
              View All Payables
            </button>
          </div>

          {/* Admin Activity Ledger */}
          <div className="rounded-2xl border border-slate-200 bg-slate-100 p-6 dark:border-slate-700 dark:bg-[#0b1326]">
            <h4 className="mb-4 text-lg font-bold text-[#191c1e] dark:text-white">
              Admin Activity Ledger
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Dividend calculation #1284
                </span>
                <span className="text-slate-400">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Loan disbursement #4390
                </span>
                <span className="text-slate-400">5 hours ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Member contribution batch processed
                </span>
                <span className="text-slate-400">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
