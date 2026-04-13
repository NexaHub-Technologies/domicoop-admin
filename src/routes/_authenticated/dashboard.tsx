import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState, useMemo } from "react"
import {
  dashboardStats,
  mockMembers,
  mockLoans,
  activityFeed,
  mockContributionsTrend,
  mockContributions1Y,
  mockContributionsAll,
  filterMembersByStatus,
  exportMembersToCSV,
  downloadCSV,
  type Member,
  type Loan,
} from "../../lib/mock-data"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  UserGroupIcon,
  MoneySend01Icon,
  Task01Icon,
  Message02Icon,
  FilterHorizontalIcon,
  ArrowRight01Icon,
  AuctionIcon,
  PencilEdit01Icon,
  ViewIcon,
  CheckmarkCircle02Icon,
  CancelSquareIcon,
} from "@hugeicons/core-free-icons"

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
})

const chartConfig = {
  amount: {
    label: "Contributions",
    color: "hsl(var(--chart-1))",
  },
}

type TimeRange = "6M" | "1Y" | "ALL"

function DashboardPage() {
  const navigate = useNavigate()

  // Phase 2: Chart Time Range State
  const [timeRange, setTimeRange] = useState<TimeRange>("6M")

  // Phase 3: Members Filter State
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "pending"
  >("all")
  const [editingMember, setEditingMember] = useState<Member | null>(null)

  // Phase 4: Loan State
  const [loans, setLoans] = useState<Loan[]>(mockLoans)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  // Phase 5: Add Member Modal State
  const [showAddMember, setShowAddMember] = useState(false)
  const [members, setMembers] = useState<Member[]>(mockMembers)

  // Chart data based on time range
  const chartData = useMemo(() => {
    switch (timeRange) {
      case "6M":
        return mockContributionsTrend
      case "1Y":
        return mockContributions1Y
      case "ALL":
        return mockContributionsAll
    }
  }, [timeRange])

  // Y-axis domain based on data
  const yAxisDomain = useMemo(() => {
    const maxAmount = Math.max(...chartData.map((d) => d.amount))
    return [0, Math.ceil(maxAmount / 50000) * 50000]
  }, [chartData])

  // Filtered members
  const filteredMembers = useMemo(() => {
    return filterMembersByStatus(members, filterStatus).slice(0, 5)
  }, [members, filterStatus])

  // Pending loans
  const pendingLoans = loans.filter((loan) => loan.status === "pending")

  // Show toast notification
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Handlers
  const handleExportMembersCSV = () => {
    const csv = exportMembersToCSV(members)
    downloadCSV(csv, "members_export.csv")
    showToast("Members exported successfully!", "success")
  }

  const handleViewMember = (memberId: string) => {
    navigate({ to: "/members/$memberId", params: { memberId } })
  }

  const handleEditMember = (member: Member) => {
    setEditingMember(member)
  }

  const handleSaveMember = () => {
    if (editingMember) {
      setMembers((prev) =>
        prev.map((m) => (m.id === editingMember.id ? editingMember : m))
      )
      showToast(`Member #${editingMember.id} updated successfully!`, "success")
      setEditingMember(null)
    }
  }

  const handleAddMember = (newMember: Omit<Member, "id" | "initials">) => {
    const id = String(Math.max(...members.map((m) => parseInt(m.id))) + 1)
    const initials = newMember.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    const member: Member = { ...newMember, id, initials }
    setMembers((prev) => [member, ...prev])
    showToast(`Member ${newMember.name} added successfully!`, "success")
    setShowAddMember(false)
  }

  const handleApproveLoan = (loanId: string) => {
    setLoans((prev) =>
      prev.map((loan) =>
        loan.id === loanId ? { ...loan, status: "approved" } : loan
      )
    )
    showToast(`Loan #${loanId} approved successfully!`, "success")
  }

  const handleReviewLoan = (loanId: string) => {
    navigate({ to: "/loans", search: { id: loanId } })
  }

  const handleOpenApprovalPanel = () => {
    navigate({ to: "/loans" })
  }

  const handleViewLogs = () => {
    navigate({ to: "/logs" })
  }

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Toast Notification */}
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

      {/* Page Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-2 block text-xs font-bold tracking-[0.2em] text-[#003d9a] uppercase dark:text-[#b2c5ff]">
            System Overview
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#191c1e] sm:text-3xl lg:text-4xl dark:text-white">
            Executive Dashboard
          </h2>
        </div>
        <div className="flex gap-2 sm:space-x-3">
          <button
            onClick={handleExportMembersCSV}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-[#191c1e] shadow-sm transition-colors hover:bg-slate-50 sm:px-4 sm:text-sm dark:border-slate-700 dark:bg-[#0b1326] dark:text-white dark:hover:bg-slate-800"
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowAddMember(true)}
            className="rounded-lg bg-gradient-to-br from-[#1e55be] to-[#003d9a] px-3 py-2 text-xs font-bold text-white shadow-md transition-transform active:scale-95 sm:px-4 sm:text-sm"
          >
            Add New Member
          </button>
        </div>
      </section>

      {/* Key Stats Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <StatCard
          icon={UserGroupIcon}
          label="Total Members"
          value={dashboardStats.totalMembers.toLocaleString()}
          trend={`+${dashboardStats.memberGrowth}%`}
          trendType="positive"
        />
        <StatCard
          icon={MoneySend01Icon}
          label="Total Contributions"
          value={`$${(dashboardStats.totalContributions / 1000000).toFixed(1)}M`}
          trend={`+${dashboardStats.contributionGrowth}%`}
          trendType="positive"
        />
        <StatCard
          icon={Task01Icon}
          label="Pending Loans"
          value={pendingLoans.length.toString()}
          badge="URGENT"
        />
        <StatCard
          icon={Message02Icon}
          label="Active Correspondence"
          value={dashboardStats.activeCorrespondence.toString()}
          subLabel="Live"
        />
      </section>

      {/* Main Interactive Section */}
      <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Contribution Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-lg sm:text-xl">
                Contribution Trends
              </CardTitle>
              <CardDescription>
                Capital growth trajectory over{" "}
                {timeRange === "6M"
                  ? "6 months"
                  : timeRange === "1Y"
                    ? "12 months"
                    : "24 months"}
              </CardDescription>
            </div>
            <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              {(["6M", "1Y", "ALL"] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`rounded-md px-2 py-1 text-xs font-bold transition-all sm:px-3 ${
                    timeRange === range
                      ? "bg-[#003d9a] text-white shadow-sm"
                      : "text-slate-500 hover:text-[#191c1e] dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis hide domain={yAxisDomain} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => [
                            `$${Number(value).toLocaleString()}`,
                            "Amount",
                          ]}
                        />
                      }
                    />
                    <Bar
                      dataKey="amount"
                      fill="#1e55be"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">System Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 sm:space-y-6">
              {activityFeed.map((activity) => (
                <div key={activity.id} className="flex space-x-3 sm:space-x-4">
                  <div
                    className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full shadow-sm ${
                      activity.priority === "high"
                        ? "bg-[#1e55be]"
                        : activity.type === "system"
                          ? "bg-[#9b3e00]"
                          : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#191c1e] dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-slate-500 opacity-60 dark:text-slate-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleViewLogs}
              className="mt-4 flex items-center justify-center text-sm font-bold text-[#003d9a] transition-all hover:underline sm:mt-6 dark:text-[#b2c5ff]"
            >
              View Full Logs
              <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1 h-4 w-4" />
            </button>
          </CardContent>
        </Card>
      </section>

      {/* Bottom Layout: Table & Quick Actions */}
      <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
        {/* Members Table */}
        <Card className="overflow-hidden lg:col-span-3">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg sm:text-xl">Recent Members</CardTitle>
            <div className="relative">
              <HugeiconsIcon
                icon={FilterHorizontalIcon}
                className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as "all" | "active" | "pending"
                  )
                }
                className="rounded-lg border-none bg-slate-50 py-2 pr-4 pl-8 text-xs font-bold text-[#191c1e] focus:ring-1 focus:ring-[#1e55be]/40 dark:bg-slate-800 dark:text-white"
              >
                <option value="all">Status: All</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 dark:bg-slate-800/50 dark:hover:bg-slate-800/50">
                    <TableHead className="text-[10px] font-black tracking-widest uppercase">
                      ID
                    </TableHead>
                    <TableHead className="text-[10px] font-black tracking-widest uppercase">
                      Identity
                    </TableHead>
                    <TableHead className="text-[10px] font-black tracking-widest uppercase">
                      Status
                    </TableHead>
                    <TableHead className="hidden text-[10px] font-black tracking-widest uppercase sm:table-cell">
                      Joined
                    </TableHead>
                    <TableHead className="text-right text-[10px] font-black tracking-widest uppercase">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-8 text-center text-slate-500"
                      >
                        No members found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => (
                      <TableRow
                        key={member.id}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <TableCell className="font-bold text-[#1e55be] dark:text-[#b2c5ff]">
                          #{member.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 sm:h-8 sm:w-8 dark:bg-slate-700 dark:text-slate-400">
                              {member.initials}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-[#191c1e] dark:text-white">
                                {member.name}
                              </p>
                              <p className="hidden truncate text-xs text-slate-500 sm:block dark:text-slate-400">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              member.status === "active"
                                ? "default"
                                : member.status === "pending"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={`text-[10px] font-black uppercase ${
                              member.status === "active"
                                ? "bg-[#1e55be]/10 text-[#1e55be] hover:bg-[#1e55be]/20 dark:bg-[#b2c5ff]/20 dark:text-[#b2c5ff]"
                                : member.status === "pending"
                                  ? "bg-[#9b3e00]/10 text-[#9b3e00] hover:bg-[#9b3e00]/20 dark:bg-[#ffb690]/20 dark:text-[#ffb690]"
                                  : ""
                            }`}
                          >
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden text-sm text-slate-500 sm:table-cell dark:text-slate-400">
                          {new Date(member.joinDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleEditMember(member)}
                              className="p-1 text-slate-400 transition-colors hover:text-[#003d9a] sm:p-2 dark:hover:text-[#b2c5ff]"
                            >
                              <HugeiconsIcon
                                icon={PencilEdit01Icon}
                                className="h-5 w-5"
                              />
                            </button>
                            <button
                              onClick={() => handleViewMember(member.id)}
                              className="p-1 text-slate-400 transition-colors hover:text-[#003d9a] sm:p-2 dark:hover:text-[#b2c5ff]"
                            >
                              <HugeiconsIcon
                                icon={ViewIcon}
                                className="h-5 w-5"
                              />
                            </button>
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

        {/* Loan Queue Quick Access */}
        <Card className="flex flex-col justify-between bg-slate-100 dark:bg-[#0b1326]">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={AuctionIcon}
                className="h-5 w-5 text-[#9b3e00]"
              />
              <CardTitle className="text-base sm:text-lg">
                Queue: Loans
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-3 sm:space-y-4">
              {pendingLoans.length === 0 ? (
                <p className="text-sm text-slate-500">No pending loans</p>
              ) : (
                pendingLoans.slice(0, 2).map((loan, index) => (
                  <div
                    key={loan.id}
                    className={`rounded-xl border border-slate-50 p-3 shadow-sm sm:p-4 dark:border-slate-700 ${
                      index === 0
                        ? "bg-white dark:bg-[#060e20]"
                        : "bg-white/60 opacity-60 dark:bg-[#060e20]/60"
                    }`}
                  >
                    <p className="mb-1 text-xs font-bold text-[#003d9a] dark:text-[#b2c5ff]">
                      REQ #{loan.id}
                    </p>
                    <p className="text-sm font-medium text-[#191c1e] dark:text-white">
                      ${loan.amount.toLocaleString()}.00{" "}
                      {loan.type.charAt(0).toUpperCase() + loan.type.slice(1)}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      By: {loan.borrowerName}
                    </p>
                    {index === 0 && (
                      <div className="mt-3 flex gap-2 sm:mt-4">
                        <button
                          onClick={() => handleApproveLoan(loan.id)}
                          className="flex-1 rounded-lg bg-[#003d9a] py-1.5 text-[10px] font-black text-white uppercase shadow-sm transition-all hover:brightness-110 sm:py-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReviewLoan(loan.id)}
                          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-1.5 text-[10px] font-black text-[#191c1e] uppercase transition-all hover:bg-slate-100 sm:py-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                        >
                          Review
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            <button
              onClick={handleOpenApprovalPanel}
              className="mt-4 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-all hover:border-[#003d9a]/40 hover:text-[#191c1e] sm:mt-6 sm:py-3 dark:border-slate-700 dark:bg-[#060e20] dark:text-slate-400 dark:hover:text-white"
            >
              Open Approval Panel
            </button>
          </CardContent>
        </Card>
      </section>

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-[#0b1326]">
            <h3 className="mb-4 text-lg font-bold text-[#191c1e] dark:text-white">
              Edit Member #{editingMember.id}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  Name
                </label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  Email
                </label>
                <input
                  type="email"
                  value={editingMember.email}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  Status
                </label>
                <select
                  value={editingMember.status}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      status: e.target.value as Member["status"],
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setEditingMember(null)}
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMember}
                className="flex-1 rounded-lg bg-[#003d9a] py-2 text-sm font-bold text-white transition-colors hover:brightness-110"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <AddMemberModal
          onClose={() => setShowAddMember(false)}
          onSubmit={handleAddMember}
        />
      )}

      {/* Footer Spacing */}
      <div className="h-10 sm:h-20"></div>
    </div>
  )
}

// Add Member Modal Component
function AddMemberModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (member: Omit<Member, "id" | "initials">) => void
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"active" | "pending">("pending")
  const joinDate = new Date().toISOString().split("T")[0]
  const [contributions, setContributions] = useState(0)
  const activeLoans = 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) {
      return
    }
    onSubmit({
      name,
      email,
      status,
      joinDate,
      contributions,
      activeLoans,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-[#0b1326]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#191c1e] dark:text-white">
            Add New Member
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <HugeiconsIcon icon={CancelSquareIcon} className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Status
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "active" | "pending")
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Initial Contribution
            </label>
            <input
              type="number"
              value={contributions}
              onChange={(e) => setContributions(Number(e.target.value))}
              min="0"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              placeholder="0"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-[#003d9a] py-2 text-sm font-bold text-white transition-colors hover:brightness-110"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({
  icon,
  label,
  value,
  trend,
  trendType,
  badge,
  subLabel,
}: {
  icon: IconSvgElement
  label: string
  value: string
  trend?: string
  trendType?: "positive" | "negative"
  badge?: string
  subLabel?: string
}) {
  return (
    <Card className="group relative overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-[#1e55be]/5 blur-2xl transition-all group-hover:bg-[#1e55be]/10 dark:bg-[#1e55be]/10 dark:group-hover:bg-[#1e55be]/20"></div>
        <div className="mb-3 flex items-start justify-between sm:mb-4">
          <HugeiconsIcon
            icon={icon}
            className="h-6 w-6 text-[#1e55be] sm:h-8 sm:w-8 dark:text-[#b2c5ff]"
          />
          {trend && (
            <span
              className={
                trendType === "positive"
                  ? "text-xs font-bold text-green-600"
                  : "text-xs font-bold text-red-600"
              }
            >
              {trend}
            </span>
          )}
          {badge && (
            <Badge variant="destructive" className="text-[10px] font-bold">
              {badge}
            </Badge>
          )}
          {subLabel && (
            <span className="text-xs font-bold text-slate-400">{subLabel}</span>
          )}
        </div>
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
