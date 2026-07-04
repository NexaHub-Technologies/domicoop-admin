import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useState, useMemo, useEffect, useCallback } from "react"
import { membersApi } from "../../lib/api/members"
import { notificationsApi } from "../../lib/api/notifications"
import { ApiError } from "../../lib/http"
import type { Member } from "../../lib/types/auth"
import type { CreateMemberInput } from "../../lib/types/members"
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
  CheckmarkCircle02Icon,
  CancelSquareIcon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons"

export const Route = createFileRoute("/_authenticated/members")({
  component: MembersPage,
})

type StatusFilter = "all" | "active" | "pending" | "suspended"

const chartConfig = {
  value: {
    label: "Members",
    color: "hsl(var(--chart-1))",
  },
}

const PAGE_SIZE = 25

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Membership growth over the last 6 months, from members' created_at.
function computeGrowth(members: Member[]) {
  const groups = new Map<string, number>()
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    groups.set(`${d.getFullYear()}-${d.getMonth()}`, 0)
  }
  for (const m of members) {
    const d = new Date(m.created_at)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (groups.has(key)) groups.set(key, (groups.get(key) ?? 0) + 1)
  }
  return Array.from(groups.entries()).map(([key, value]) => {
    const [y, mo] = key.split("-")
    const d = new Date(Number(y), Number(mo), 1)
    return { month: d.toLocaleDateString("en-US", { month: "short" }), value }
  })
}

function MembersPage() {
  const navigate = useNavigate()
  const [members, setMembers] = useState<Member[]>([])
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filter, setFilter] = useState<StatusFilter>("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
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

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await membersApi.list({ page, limit: PAGE_SIZE })
      setMembers(res.data)
      setTotal(res.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load members")
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Client-side search + status filter over the loaded page.
  const filteredMembers = useMemo(() => {
    let result = members
    if (filter !== "all") result = result.filter((m) => m.status === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (m) =>
          m.full_name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          (m.member_no ?? "").toLowerCase().includes(q)
      )
    }
    return result
  }, [members, filter, search])

  const growthData = useMemo(() => computeGrowth(members), [members])
  const pendingCount = useMemo(
    () => members.filter((m) => m.status === "pending").length,
    [members]
  )
  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1

  const handleCreateMember = async (input: CreateMemberInput) => {
    try {
      await membersApi.create(input)
      showToast(`Member ${input.full_name} created.`, "success")
      setShowCreateModal(false)
      fetchData()
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Failed to create member",
        "error"
      )
    }
  }

  const handleUpdateMember = async (
    id: string,
    data: { status?: Member["status"]; member_no?: string }
  ) => {
    try {
      await membersApi.updateById(id, data)
      showToast("Member updated.", "success")
      setEditingMember(null)
      fetchData()
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Failed to update member",
        "error"
      )
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await membersApi.approve(id)
      showToast("Member approved and assigned a member number.", "success")
      setEditingMember(null)
      fetchData()
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Failed to approve member",
        "error"
      )
    }
  }

  const handleBroadcast = async (title: string, body: string) => {
    try {
      const res = await notificationsApi.broadcast({ title, body })
      showToast(`Broadcast sent to ${res.sent} members.`, "success")
      setShowBroadcastModal(false)
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Failed to send broadcast",
        "error"
      )
    }
  }

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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end sm:gap-6">
        <div className="space-y-1">
          <p className="text-xs font-bold tracking-widest text-[#003d9a] uppercase dark:text-[#b2c5ff]">
            Administration
          </p>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#191c1e] sm:text-3xl dark:text-white">
            Member Management
          </h2>
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
            Oversee and manage your cooperative&apos;s membership base, approve
            applications, and keep records current.
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
          {(["all", "active", "pending", "suspended"] as StatusFilter[]).map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
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
            )
          )}
          <div className="relative ml-auto">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                  <TableHead className="w-[140px] text-[10px] font-black tracking-widest uppercase">
                    Member No
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest uppercase">
                    Identity
                  </TableHead>
                  <TableHead className="text-[10px] font-black tracking-widest uppercase">
                    Status
                  </TableHead>
                  <TableHead className="hidden text-[10px] font-black tracking-widest uppercase sm:table-cell">
                    Phone
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
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-slate-500"
                    >
                      Loading members…
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-red-500"
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
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
                        {member.member_no || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 sm:h-10 sm:w-10 dark:bg-slate-700 dark:text-slate-400">
                            {getInitials(member.full_name)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-[#191c1e] dark:text-white">
                              {member.full_name}
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
                        {member.phone || "—"}
                      </TableCell>
                      <TableCell className="hidden text-sm text-slate-500 md:table-cell dark:text-slate-400">
                        {new Date(member.created_at).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" }
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {member.status === "pending" && (
                            <button
                              onClick={() => handleApprove(member.id)}
                              title="Approve member"
                              className="p-1 text-slate-400 transition-colors hover:text-green-600 sm:p-2"
                            >
                              <HugeiconsIcon
                                icon={CheckmarkCircle02Icon}
                                className="h-5 w-5"
                              />
                            </button>
                          )}
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
          {total !== null ? ` of ${totalPages} · ${total} members` : ""}
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

      {/* Growth + Quick Actions */}
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
                onClick={() => setFilter("pending")}
                className="w-full bg-white/10 text-white hover:bg-white/20"
              >
                <HugeiconsIcon icon={Task01Icon} className="mr-2 h-4 w-4" />
                Pending Applications ({pendingCount})
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
              <Button
                onClick={() => navigate({ to: "/announcements" })}
                className="w-full bg-white/10 text-white hover:bg-white/20"
              >
                <HugeiconsIcon
                  icon={Megaphone01Icon}
                  className="mr-2 h-4 w-4"
                />
                Announcements
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {showCreateModal && (
        <CreateMemberModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateMember}
        />
      )}

      {editingMember && (
        <EditMemberModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSave={(data) => handleUpdateMember(editingMember.id, data)}
          onApprove={
            editingMember.status === "pending"
              ? () => handleApprove(editingMember.id)
              : undefined
          }
        />
      )}

      {showBroadcastModal && (
        <BroadcastModal
          onClose={() => setShowBroadcastModal(false)}
          onSubmit={handleBroadcast}
        />
      )}
    </div>
  )
}

// Create Member Modal — POST /members
function CreateMemberModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (input: CreateMemberInput) => void
}) {
  const [form, setForm] = useState<CreateMemberInput>({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    address: "",
    next_of_kin: "",
  })

  const set = (k: keyof CreateMemberInput, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password || !form.full_name) return
    onSubmit(form)
  }

  return (
    <ModalShell title="Create New Member" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full Name *">
          <input
            type="text"
            value={form.full_name}
            onChange={(e) => set("full_name", e.target.value)}
            required
            className={inputCls}
          />
        </Field>
        <Field label="Email Address *">
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            required
            className={inputCls}
          />
        </Field>
        <Field label="Password *">
          <input
            type="password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            required
            minLength={8}
            className={inputCls}
          />
        </Field>
        <Field label="Phone">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Address">
          <input
            type="text"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Next of Kin">
          <input
            type="text"
            value={form.next_of_kin ?? ""}
            onChange={(e) => set("next_of_kin", e.target.value)}
            className={inputCls}
          />
        </Field>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className={cancelBtnCls}>
            Cancel
          </button>
          <button type="submit" className={submitBtnCls}>
            Create Member
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

// Edit Member Modal — PATCH /members/:id accepts only status + member_no (§4)
function EditMemberModal({
  member,
  onClose,
  onSave,
  onApprove,
}: {
  member: Member
  onClose: () => void
  onSave: (data: { status?: Member["status"]; member_no?: string }) => void
  onApprove?: () => void
}) {
  const [status, setStatus] = useState<Member["status"]>(member.status)
  const [memberNo, setMemberNo] = useState(member.member_no ?? "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ status, member_no: memberNo || undefined })
  }

  return (
    <ModalShell title={`Edit ${member.full_name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Member["status"])}
            className={inputCls}
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </Field>
        <Field label="Member No">
          <input
            type="text"
            value={memberNo}
            onChange={(e) => setMemberNo(e.target.value)}
            placeholder="DOMICOOP-0007"
            className={inputCls}
          />
        </Field>
        <div className="flex flex-wrap gap-3 pt-2">
          {onApprove && (
            <button
              type="button"
              onClick={onApprove}
              className="flex-1 rounded-lg border border-green-200 bg-green-50 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
            >
              Approve
            </button>
          )}
          <button type="button" onClick={onClose} className={cancelBtnCls}>
            Cancel
          </button>
          <button type="submit" className={submitBtnCls}>
            Save Changes
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

// Broadcast Modal — POST /notifications/broadcast
function BroadcastModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (title: string, body: string) => void
}) {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    onSubmit(title, body)
  }

  return (
    <ModalShell title="Member Broadcast" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Title">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputCls}
          />
        </Field>
        <Field label="Message">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={4}
            className={inputCls}
            placeholder="Type your message to all active members…"
          />
        </Field>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Sent to all active members (in-app + push).
        </p>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className={cancelBtnCls}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || !body.trim()}
            className={`${submitBtnCls} disabled:opacity-50`}
          >
            Send Broadcast
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

// --- Small shared modal primitives ---

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
const cancelBtnCls =
  "flex-1 rounded-lg border border-slate-200 bg-slate-50 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
const submitBtnCls =
  "flex-1 rounded-lg bg-[#003d9a] py-2 text-sm font-bold text-white transition-colors hover:brightness-110"

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-500">
        {label}
      </label>
      {children}
    </div>
  )
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-[#0b1326]">
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
        {children}
      </div>
    </div>
  )
}
