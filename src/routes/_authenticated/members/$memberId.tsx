import { createFileRoute } from "@tanstack/react-router"
import { mockMembers } from "../../../lib/mock-data"

export const Route = createFileRoute("/_authenticated/members/$memberId")({
  component: MemberDetailPage,
})

function MemberDetailPage() {
  const { memberId } = Route.useParams()
  const member = mockMembers.find((m) => m.id === memberId)

  if (!member) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <span className="material-symbols-outlined mb-4 text-6xl text-slate-300 dark:text-slate-600">
          person_off
        </span>
        <h2 className="mb-2 text-2xl font-bold text-[#191c1e] dark:text-white">
          Member Not Found
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          The member you are looking for does not exist.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => window.history.back()}
          className="p-2 text-slate-500 transition-colors hover:text-[#1e55be] dark:text-slate-400 dark:hover:text-[#b2c5ff]"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <span className="mb-1 block text-xs font-bold tracking-[0.2em] text-[#003d9a] uppercase dark:text-[#b2c5ff]">
            Member Details
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#191c1e] dark:text-white">
            {member.name}
          </h2>
        </div>
      </div>

      {/* Member Profile Card */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#1e55be] to-[#003d9a] text-3xl font-bold text-white">
              {member.initials}
            </div>
            <h3 className="text-xl font-bold text-[#191c1e] dark:text-white">
              {member.name}
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

          <div className="space-y-4">
            <div className="flex justify-between border-b border-slate-100 py-3 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">
                Member ID
              </span>
              <span className="font-bold text-[#191c1e] dark:text-white">
                #{member.id}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-3 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">
                Joined Date
              </span>
              <span className="font-medium text-[#191c1e] dark:text-white">
                {new Date(member.joinDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-3 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">
                Active Loans
              </span>
              <span className="font-medium text-[#191c1e] dark:text-white">
                {member.activeLoans}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button className="w-full rounded-lg bg-gradient-to-br from-[#1e55be] to-[#003d9a] py-3 font-bold text-white shadow-lg transition-all active:scale-95">
              Edit Profile
            </button>
            <button className="w-full rounded-lg border border-slate-200 py-3 font-bold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
              Send Message
            </button>
          </div>
        </div>

        {/* Right Column - Stats & Activity */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
              <p className="mb-1 text-xs tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Total Contributions
              </p>
              <p className="text-2xl font-bold text-[#191c1e] dark:text-white">
                ${member.contributions.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
              <p className="mb-1 text-xs tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Credit Score
              </p>
              <p className="text-2xl font-bold text-green-600">745</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
              <p className="mb-1 text-xs tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Dividends Earned
              </p>
              <p className="text-2xl font-bold text-[#191c1e] dark:text-white">
                $1,240
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
            <h3 className="mb-6 text-lg font-bold text-[#191c1e] dark:text-white">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <span className="material-symbols-outlined text-sm text-green-600">
                    payments
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#191c1e] dark:text-white">
                    Monthly Contribution
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    $500 deposited
                  </p>
                </div>
                <span className="text-sm text-slate-400">2 days ago</span>
              </div>
              <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e55be]/10 dark:bg-[#1e55be]/20">
                  <span className="material-symbols-outlined text-sm text-[#1e55be] dark:text-[#b2c5ff]">
                    account_balance
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#191c1e] dark:text-white">
                    Loan Application
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Applied for $5,000 personal loan
                  </p>
                </div>
                <span className="text-sm text-slate-400">1 week ago</span>
              </div>
              <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <span className="material-symbols-outlined text-sm text-amber-600">
                    redeem
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#191c1e] dark:text-white">
                    Dividend Received
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    $125 quarterly dividend
                  </p>
                </div>
                <span className="text-sm text-slate-400">2 weeks ago</span>
              </div>
            </div>
          </div>

          {/* Loan History */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
            <h3 className="mb-6 text-lg font-bold text-[#191c1e] dark:text-white">
              Loan History
            </h3>
            {member.activeLoans > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  <div>
                    <p className="font-medium text-[#191c1e] dark:text-white">
                      Personal Loan #4395
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      $8,000 - Approved
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                </div>
              </div>
            ) : (
              <p className="py-8 text-center text-slate-500 dark:text-slate-400">
                No active loans
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
