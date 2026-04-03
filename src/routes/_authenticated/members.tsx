import { createFileRoute, Link } from "@tanstack/react-router"
import { mockMembers } from "../../lib/mock-data"
import { useState } from "react"
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
  const [filter, setFilter] = useState<
    "all" | "active" | "inactive" | "pending"
  >("all")

  const filteredMembers = mockMembers.filter((member) => {
    if (filter === "all") return true
    return member.status === filter
  })

  return (
    <div className="space-y-6 sm:space-y-8">
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
        <Button className="flex items-center gap-2 self-start bg-gradient-to-br from-[#1e55be] to-[#003d9a] text-white shadow-lg shadow-[#1e55be]/20 hover:brightness-110 sm:self-auto">
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
              onClick={() => setFilter(status as typeof filter)}
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
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              {filteredMembers.length} members found
            </span>
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
                {filteredMembers.map((member) => (
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
                          <HugeiconsIcon icon={ViewIcon} className="h-5 w-5" />
                        </Link>
                        <button className="p-1 text-slate-400 transition-colors hover:text-[#003d9a] sm:p-2 dark:hover:text-[#b2c5ff]">
                          <HugeiconsIcon
                            icon={PencilEdit01Icon}
                            className="h-5 w-5"
                          />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing 1-{filteredMembers.length} of {filteredMembers.length} members
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-xs sm:text-sm"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-xs sm:text-sm"
          >
            Next
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
              <Button className="w-full bg-white/10 text-white hover:bg-white/20">
                <HugeiconsIcon icon={Task01Icon} className="mr-2 h-4 w-4" />
                Pending Applications (3)
              </Button>
              <Button className="w-full bg-white/10 text-white hover:bg-white/20">
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
    </div>
  )
}
