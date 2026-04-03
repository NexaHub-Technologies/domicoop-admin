import { createFileRoute, Link } from "@tanstack/react-router"
import { mockLoans, mockMembers } from "../../lib/mock-data"

export const Route = createFileRoute("/_authenticated/loans")({
  component: LoansPage,
})

function LoansPage() {
  const pendingLoans = mockLoans.filter((loan) => loan.status === "pending")
  const totalActiveLoans = mockLoans
    .filter((loan) => loan.status === "approved" || loan.status === "disbursed")
    .reduce((sum, loan) => sum + loan.amount, 0)
  const totalDisbursed = mockLoans
    .filter((loan) => loan.status === "disbursed")
    .reduce((sum, loan) => sum + loan.amount, 0)

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <span className="mb-2 block text-xs font-bold tracking-[0.2em] text-[#003d9a] uppercase dark:text-[#b2c5ff]">
            Credit Management
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-[#191c1e] dark:text-white">
            Loan Management
          </h2>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-[#1e55be] to-[#003d9a] px-4 py-2 text-sm font-bold text-white shadow-md transition-transform active:scale-95">
          <span className="material-symbols-outlined text-sm">add</span>
          New Loan Application
        </button>
      </div>

      {/* Hero Stats */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
          <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-[#1e55be]/5 blur-2xl dark:bg-[#1e55be]/10"></div>
          <div className="mb-4 flex items-start justify-between">
            <span className="material-symbols-outlined text-3xl text-[#1e55be] dark:text-[#b2c5ff]">
              account_balance
            </span>
            <span className="text-xs font-bold text-green-600">+8.2%</span>
          </div>
          <p className="mb-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Total Active Loans
          </p>
          <h3 className="text-3xl font-bold text-[#191c1e] dark:text-white">
            ${(totalActiveLoans / 1000000).toFixed(2)}M
          </h3>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
          <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-green-500/5 blur-2xl dark:bg-green-500/10"></div>
          <div className="mb-4 flex items-start justify-between">
            <span className="material-symbols-outlined text-3xl text-green-600">
              payments
            </span>
            <span className="text-xs font-bold text-green-600">+12.5%</span>
          </div>
          <p className="mb-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Total Disbursed
          </p>
          <h3 className="text-3xl font-bold text-[#191c1e] dark:text-white">
            ${(totalDisbursed / 1000000).toFixed(1)}M
          </h3>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
          <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-amber-500/5 blur-2xl dark:bg-amber-500/10"></div>
          <div className="mb-4 flex items-start justify-between">
            <span className="material-symbols-outlined text-3xl text-amber-600">
              pending_actions
            </span>
            <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              PENDING
            </span>
          </div>
          <p className="mb-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Pending Applications
          </p>
          <h3 className="text-3xl font-bold text-[#191c1e] dark:text-white">
            {pendingLoans.length}
          </h3>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Loan Queue */}
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm lg:col-span-2 dark:border-slate-700 dark:bg-[#0b1326]">
          <div className="flex items-center justify-between border-b border-slate-50 px-8 py-6 dark:border-slate-700">
            <h4 className="text-xl font-bold text-[#191c1e] dark:text-white">
              Loan Approval Queue
            </h4>
            <div className="flex gap-2">
              <button className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700">
                All
              </button>
              <button className="rounded-lg bg-[#003d9a] px-3 py-1.5 text-xs font-medium text-white">
                Pending
              </button>
              <button className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700">
                Approved
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-8 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                    Application ID
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                    Borrower
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                    Amount
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                    Credit Score
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                    Risk
                  </th>
                  <th className="px-8 py-4 text-right text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                {mockLoans.map((loan) => (
                  <tr
                    key={loan.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-8 py-5 text-sm font-bold text-[#1e55be] dark:text-[#b2c5ff]">
                      #{loan.id}
                    </td>
                    <td className="px-8 py-5">
                      <div>
                        <p className="text-sm font-bold text-[#191c1e] dark:text-white">
                          {loan.borrowerName}
                        </p>
                        <p className="text-xs text-slate-500 capitalize dark:text-slate-400">
                          {loan.type} Loan
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-[#191c1e] dark:text-white">
                      ${loan.amount.toLocaleString()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div
                            className={`h-full rounded-full ${
                              loan.creditScore >= 750
                                ? "bg-green-500"
                                : loan.creditScore >= 650
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                            style={{
                              width: `${(loan.creditScore / 850) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          {loan.creditScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                          loan.riskProfile === "low"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : loan.riskProfile === "medium"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {loan.riskProfile}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {loan.status === "pending" ? (
                        <div className="flex justify-end gap-2">
                          <button className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-green-700">
                            Approve
                          </button>
                          <button className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-red-700">
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                            loan.status === "approved"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : loan.status === "disbursed"
                                ? "bg-[#1e55be]/10 text-[#1e55be] dark:bg-[#b2c5ff]/20 dark:text-[#b2c5ff]"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                          }`}
                        >
                          {loan.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Portfolio Analytics */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
            <h4 className="mb-4 text-lg font-bold text-[#191c1e] dark:text-white">
              Portfolio Analytics
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Default Rate
                </span>
                <span className="text-sm font-bold text-green-600">1.2%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-[98.8%] rounded-full bg-green-500"></div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Avg. Loan Size
                </span>
                <span className="text-sm font-bold text-[#191c1e] dark:text-white">
                  $9,380
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Recovery Rate
                </span>
                <span className="text-sm font-bold text-green-600">94.5%</span>
              </div>
            </div>
          </div>

          {/* Liquidity Health */}
          <div className="rounded-2xl bg-gradient-to-br from-[#1e55be] to-[#003d9a] p-6 text-white shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-bold">Liquidity Health</h4>
              <span className="material-symbols-outlined">water_drop</span>
            </div>
            <p className="mb-1 text-3xl font-bold">$1.2M</p>
            <p className="mb-4 text-sm text-white/80">
              Available for disbursement
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-[72%] rounded-full bg-white"></div>
            </div>
            <p className="mt-2 text-xs text-white/60">
              72% of total fund capacity
            </p>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
            <h4 className="mb-4 text-lg font-bold text-[#191c1e] dark:text-white">
              Recent Activity
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 rounded-full bg-green-500"></div>
                <div>
                  <p className="text-sm text-[#191c1e] dark:text-white">
                    Loan #4390 disbursed
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    5 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 rounded-full bg-[#1e55be]"></div>
                <div>
                  <p className="text-sm text-[#191c1e] dark:text-white">
                    Application #4401 received
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    2 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 rounded-full bg-amber-500"></div>
                <div>
                  <p className="text-sm text-[#191c1e] dark:text-white">
                    Credit check completed
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    1 hour ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
