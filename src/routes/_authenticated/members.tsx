import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { mockMembers, type Member } from "../../lib/mock-data"
import { useState, useMemo } from "react"
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserAdd01Icon,
  FilterHorizontalIcon,
  PencilEdit01Icon,
  ViewIcon,
  Task01Icon,
  Megaphone01Icon,
  Search01Icon,
  Delete01Icon,
  CheckmarkCircle02Icon,
  CancelSquareIcon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons"

export const Route = createFileRoute("/_authenticated/members")({
  component: MembersPage,
})

const growthData = [
  { month: "May", value: 40 },
  { month: "Jun", value: 55 },
  { month: "Jul", value: 45 },
  { month: "Aug", value: 70 },
  { month: "Sep", value: 85 },
  { month: "Oct", value: 100 },
]

const chartConfig = {
  value: {
    label: "Members",
    color: "hsl(var(--chart-1))",
  },
}

function MembersPage() {
  const navigate = useNavigate()
  const [members, setMembers] = useState<Member[]>(mockMembers)
  const [filter, setFilter] = useState<
    "all" | "active" | "inactive" | "pending"
  >("all")
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(25)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [showBroadcastModal, setShowBroadcastModal] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const filteredMembers = useMemo(() => {
    let result = members
    if (filter !== "all") {
      result = result.filter((member) => member.status === filter)
    }
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (member) =>
          member.name.toLowerCase().includes(searchLower) ||
          member.email.toLowerCase().includes(searchLower) ||
          member.id.includes(search)
      )
    }
    return result
  }, [members, filter, search])

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredMembers.slice(start, start + itemsPerPage)
  }, [filteredMembers, currentPage, itemsPerPage])

  const handleCreateMember = (newMember: Omit<Member, "id" | "initials">) => {
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
    setShowCreateModal(false)
  }

  const handleUpdateMember = (updated: Member) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
    showToast(`Member #${updated.id} updated successfully!`, "success")
    setEditingMember(null)
  }

  const handleUpdateMemberFromModal = (
    data: Omit<Member, "id" | "initials">
  ) => {
    if (editingMember) {
      const updated: Member = { ...editingMember, ...data }
      handleUpdateMember(updated)
    }
  }

  const handleDeleteMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId))
    showToast(`Member #${memberId} deleted successfully!`, "success")
    setEditingMember(null)
  }

  const handlePendingApplications = () => {
    navigate({ to: "/loans" })
  }

  const handleBroadcast = (
    broadcastMessage: string,
    recipientFilter: "all" | "active"
  ) => {
    const count =
      recipientFilter === "all"
        ? members.length
        : members.filter((m) => m.status === "active").length
    const preview =
      broadcastMessage.length > 30
        ? broadcastMessage.substring(0, 30) + "..."
        : broadcastMessage
    showToast(`Broadcast "${preview}" sent to ${count} members!`, "success")
    setShowBroadcastModal(false)
  }

  return (
    <div className="space-y-6 sm:space-y-8">
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

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end sm:gap-6">
        <div className="space-y-1">
          <p className="text-xs font-bold tracking-widest text-[#003d9a] uppercase dark:text-[#b2c5ff]">
            Administration
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#191c1e] sm:text-3xl dark:text-white">
            Member Management
          </h2>
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
            Oversee and manage your cooperative&apos;s membership base, track
            contributions, and handle loan approvals.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 self-start bg-gradient-to-br from-[#1e55be] to-[#003d9a] text-white shadow-lg shadow-[#1e55be]/20 hover:brightness-110 sm:self-auto"
        >
          <HugeiconsIcon icon={UserAdd01Icon} className="h-4 w-4" />
          Create New Member
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-500 sm:px-4 dark:text-slate-400">
            <HugeiconsIcon
              icon={FilterHorizontalIcon}
              className="h-4 w-4 sm:h-5 sm:w-5"
            />
            <span>Status:</span>
          </div>
          {["all", "active", "inactive", "pending"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status as typeof filter)
                setCurrentPage(1)
              }}
              className={`rounded-lg px-2 py-1.5 text-xs font-semibold transition-all sm:px-4 sm:py-2 sm:text-sm ${
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
          <div className="relative ml-auto">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-9 text-xs font-medium text-[#191c1e] placeholder:text-slate-400 focus:border-[#003d9a] focus:outline-none sm:py-2 sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>
      </Card>

      {/* Members Table */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 dark:bg-slate-800/50 dark:hover:bg-slate-800/50">
                  <TableHead className="w-[80px] text-[10px] font-black tracking-widest uppercase">
                    ID
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest uppercase">
                    Identity
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest uppercase">
                    Status
                  </TableHead>
                  <TableHead className="hidden text-[10px] font-black tracking-widest uppercase sm:table-cell">
                    Contributions
                  </TableHead>
                  <TableHead className="hidden text-[10px] font-black tracking-widest uppercase sm:table-cell">
                    Loans
                  </TableHead>
                  <TableHead className="hidden text-[10px] font-black tracking-widest uppercase md:table-cell">
                    Joined
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-black tracking-widest uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMembers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-8 text-center text-slate-500"
                    >
                      No members found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedMembers.map((member) => (
                    <TableRow
                      key={member.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <TableCell className="font-bold text-[#1e55be] dark:text-[#b2c5ff]">
                        #{member.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 sm:h-10 sm:w-10 dark:bg-slate-700 dark:text-slate-400">
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
                              ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                              : member.status === "pending"
                                ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                          }`}
                        >
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden text-sm text-slate-600 sm:table-cell dark:text-slate-400">
                        ${member.contributions.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden text-sm text-slate-600 sm:table-cell dark:text-slate-400">
                        {member.activeLoans}
                      </TableCell>
                      <TableCell className="hidden text-sm text-slate-500 md:table-cell dark:text-slate-400">
                        {new Date(member.joinDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link
                            to="/members/$memberId"
                            params={{ memberId: member.id }}
                            className="p-1 text-slate-400 transition-colors hover:text-[#003d9a] sm:p-2 dark:hover:text-[#b2c5ff]"
                          >
                            <HugeiconsIcon
                              icon={ViewIcon}
                              className="h-5 w-5"
                            />
                          </Link>
                          <button
                            onClick={() => setEditingMember(member)}
                            className="p-1 text-slate-400 transition-colors hover:text-[#003d9a] sm:p-2 dark:hover:text-[#b2c5ff]"
                          >
                            <HugeiconsIcon
                              icon={PencilEdit01Icon}
                              className="h-5 w-5"
                            />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="p-1 text-slate-400 transition-colors hover:text-red-500 sm:p-2"
                          >
                            <HugeiconsIcon
                              icon={Delete01Icon}
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

      {/* Pagination */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of{" "}
          {filteredMembers.length} members
        </p>
        <div className="flex gap-2">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            className="text-xs sm:text-sm"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages || totalPages === 0}
            className="text-xs sm:text-sm"
          >
            Next
            <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Growth Analytics Section */}
      <section className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">
              Membership Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 sm:h-40">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={growthData}>
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => [`${value} members`, "Count"]}
                        />
                      }
                    />
                    <Bar dataKey="value" fill="#1e55be" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#1e55be] to-[#003d9a] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white sm:text-lg">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-white/80">
              Manage member operations efficiently
            </p>
            <div className="space-y-2 sm:space-y-3">
              <Button
                onClick={handlePendingApplications}
                className="w-full bg-white/10 text-white hover:bg-white/20"
              >
                <HugeiconsIcon icon={Task01Icon} className="mr-2 h-4 w-4" />
                Pending Applications (
                {members.filter((m) => m.status === "pending").length})
              </Button>
              <Button
                onClick={() => setShowBroadcastModal(true)}
                className="w-full bg-white/10 text-white hover:bg-white/20"
              >
                <HugeiconsIcon
                  icon={Megaphone01Icon}
                  className="mr-2 h-4 w-4"
                />
                Member Broadcast
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Create Member Modal */}
      {showCreateModal && (
        <MemberFormModal
          title="Create New Member"
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateMember}
        />
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <MemberFormModal
          title={`Edit Member #${editingMember.id}`}
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSubmit={handleUpdateMemberFromModal}
          onDelete={() => handleDeleteMember(editingMember.id)}
        />
      )}

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <BroadcastModal
          memberCount={members.length}
          activeCount={members.filter((m) => m.status === "active").length}
          onClose={() => setShowBroadcastModal(false)}
          onSubmit={handleBroadcast}
        />
      )}
    </div>
  )
}

// Member Form Modal Component
function MemberFormModal({
  title,
  member,
  onClose,
  onSubmit,
  onDelete,
}: {
  title: string
  member?: Member
  onClose: () => void
  onSubmit: (member: Omit<Member, "id" | "initials">) => void
  onDelete?: () => void
}) {
  const [name, setName] = useState(member?.name || "")
  const [email, setEmail] = useState(member?.email || "")
  const [status, setStatus] = useState<"active" | "inactive" | "pending">(
    member?.status || "pending"
  )
  const [contributions, setContributions] = useState(member?.contributions || 0)
  const [activeLoans, setActiveLoans] = useState(member?.activeLoans || 0)
  const joinDate = member?.joinDate || new Date().toISOString().split("T")[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return
    onSubmit({ name, email, status, joinDate, contributions, activeLoans })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-[#0b1326]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#191c1e] dark:text-white">
            {title}
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
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Status
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "active" | "inactive" | "pending")
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Contributions
            </label>
            <input
              type="number"
              value={contributions}
              onChange={(e) => setContributions(Number(e.target.value))}
              min="0"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Active Loans
            </label>
            <input
              type="number"
              value={activeLoans}
              onChange={(e) => setActiveLoans(Number(e.target.value))}
              min="0"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div className="flex gap-3 pt-2">
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex-1 rounded-lg border border-red-200 bg-red-50 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                Delete
              </button>
            )}
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
              {member ? "Save Changes" : "Create Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Broadcast Modal Component
function BroadcastModal({
  memberCount,
  activeCount,
  onClose,
  onSubmit,
}: {
  memberCount: number
  activeCount: number
  onClose: () => void
  onSubmit: (message: string, recipientFilter: "all" | "active") => void
}) {
  const [message, setMessage] = useState("")
  const [recipients, setRecipients] = useState<"all" | "active">("all")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    onSubmit(message, recipients)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-[#0b1326]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#191c1e] dark:text-white">
            Member Broadcast
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
              Recipients
            </label>
            <select
              value={recipients}
              onChange={(e) =>
                setRecipients(e.target.value as "all" | "active")
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="all">All Members ({memberCount})</option>
              <option value="active">Active Members ({activeCount})</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              placeholder="Type your message to members..."
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
              disabled={!message.trim()}
              className="flex-1 rounded-lg bg-[#003d9a] py-2 text-sm font-bold text-white transition-colors hover:brightness-110 disabled:opacity-50"
            >
              Send Broadcast
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
