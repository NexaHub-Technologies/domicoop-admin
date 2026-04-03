import { createFileRoute, Link } from "@tanstack/react-router"
import { mockMembers } from "../../lib/mock-data"
import { useState } from "react"

export const Route = createFileRoute("/_authenticated/members")({
  component: MembersPage,
})

function MembersPage() {
  const [filter, setFilter] = useState<
    "all" | "active" | "inactive" | "pending"
  >("all")

  const filteredMembers = mockMembers.filter((member) => {
    if (filter === "all") return true
    return member.status === filter
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-1">
          <p className="text-xs font-bold tracking-widest text-[#003d9a] uppercase dark:text-[#b2c5ff]">
            Administration
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#191c1e] dark:text-white">
            Member Management
          </h2>
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
            Oversee and manage your cooperative&apos;s membership base, track
            contributions, and handle loan approvals.
          </p>
        </div>
        <button className="flex items-center gap-2 self-start rounded-lg bg-gradient-to-br from-[#1e55be] to-[#003d9a] px-6 py-3 font-bold text-white shadow-lg shadow-[#1e55be]/20 transition-all md:self-auto">
          <span className="material-symbols-outlined">person_add</span>
          Create New Member
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
        <div className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined text-lg">filter_list</span>
          <span>Status:</span>
        </div>
        {["all", "active", "inactive", "pending"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as typeof filter)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              filter === status
                ? "bg-[#003d9a] text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            {status === "all"
              ? "All Members"
              : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {filteredMembers.length} members found
          </span>
        </div>
      </div>

      {/* Members Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-8 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                  Member ID
                </th>
                <th className="px-8 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                  Identity
                </th>
                <th className="px-8 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                  Status
                </th>
                <th className="px-8 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                  Contributions
                </th>
                <th className="px-8 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                  Active Loans
                </th>
                <th className="px-8 py-4 text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                  Joined Date
                </th>
                <th className="px-8 py-4 text-right text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-8 py-5 text-sm font-bold text-[#1e55be] dark:text-[#b2c5ff]">
                    #{member.id}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                        {member.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#191c1e] dark:text-white">
                          {member.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                        member.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : member.status === "pending"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-600 dark:text-slate-400">
                    ${member.contributions.toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-600 dark:text-slate-400">
                    {member.activeLoans}
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400">
                    {new Date(member.joinDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="space-x-2 px-8 py-5 text-right">
                    <Link
                      to="/members/$memberId"
                      params={{ memberId: member.id }}
                      className="p-2 text-slate-400 transition-colors hover:text-[#003d9a] dark:hover:text-[#b2c5ff]"
                    >
                      <span className="material-symbols-outlined text-lg">
                        visibility
                      </span>
                    </Link>
                    <button className="p-2 text-slate-400 transition-colors hover:text-[#003d9a] dark:hover:text-[#b2c5ff]">
                      <span className="material-symbols-outlined text-lg">
                        edit
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing 1-{filteredMembers.length} of {filteredMembers.length} members
        </p>
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-[#0b1326] dark:text-slate-400 dark:hover:bg-slate-800"
            disabled
          >
            Previous
          </button>
          <button
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-[#0b1326] dark:text-slate-400 dark:hover:bg-slate-800"
            disabled
          >
            Next
          </button>
        </div>
      </div>

      {/* Growth Analytics Section */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
          <h4 className="mb-4 text-lg font-bold text-[#191c1e] dark:text-white">
            Membership Growth
          </h4>
          <div className="flex h-32 items-end justify-between space-x-2">
            {[40, 55, 45, 70, 85, 100].map((height, i) => (
              <div
                key={i}
                className="w-full rounded-t-lg bg-gradient-to-t from-[#1e55be]/20 to-[#1e55be]/5"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-[#1e55be] to-[#003d9a] p-6 text-white shadow-lg">
          <h4 className="mb-2 text-lg font-bold">Quick Actions</h4>
          <p className="mb-4 text-sm text-white/80">
            Manage member operations efficiently
          </p>
          <div className="space-y-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 py-3 text-sm font-medium transition-colors hover:bg-white/20">
              <span className="material-symbols-outlined text-sm">
                pending_actions
              </span>
              Pending Applications (3)
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 py-3 text-sm font-medium transition-colors hover:bg-white/20">
              <span className="material-symbols-outlined text-sm">
                campaign
              </span>
              Member Broadcast
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
