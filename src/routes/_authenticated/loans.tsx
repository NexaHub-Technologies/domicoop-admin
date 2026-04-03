import { createFileRoute } from "@tanstack/react-router"
import { mockLoans } from "../../lib/mock-data"
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
  Add01Icon,
  BankIcon,
  MoneySend01Icon,
  Task01Icon,
  DropletIcon,
} from "@hugeicons/core-free-icons"

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
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-2 block text-xs font-bold tracking-[0.2em] text-[#003d9a] uppercase dark:text-[#b2c5ff]">
            Credit Management
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#191c1e] sm:text-3xl lg:text-4xl dark:text-white">
            Loan Management
          </h2>
        </div>
        <Button className="flex items-center gap-2 self-start bg-gradient-to-br from-[#1e55be] to-[#003d9a] text-white shadow-md transition-transform active:scale-95 sm:self-auto">
          <HugeiconsIcon icon={Add01Icon} className="h-4 w-4" />
          New Loan Application
        </Button>
      </div>

      {/* Hero Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <Card className="group relative overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-[#1e55be]/5 blur-2xl dark:bg-[#1e55be]/10"></div>
            <div className="mb-3 flex items-start justify-between sm:mb-4">
              <HugeiconsIcon
                icon={BankIcon}
                className="h-6 w-6 text-[#1e55be] sm:h-8 sm:w-8 dark:text-[#b2c5ff]"
              />
              <span className="text-xs font-bold text-green-600">+8.2%</span>
            </div>
            <p className="mb-1 text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
              Total Active Loans
            </p>
            <h3 className="text-2xl font-bold text-[#191c1e] sm:text-3xl dark:text-white">
              ${(totalActiveLoans / 1000000).toFixed(2)}M
            </h3>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-green-500/5 blur-2xl dark:bg-green-500/10"></div>
            <div className="mb-3 flex items-start justify-between sm:mb-4">
              <HugeiconsIcon
                icon={MoneySend01Icon}
                className="h-6 w-6 text-green-600 sm:h-8 sm:w-8"
              />
              <span className="text-xs font-bold text-green-600">+12.5%</span>
            </div>
            <p className="mb-1 text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
              Total Disbursed
            </p>
            <h3 className="text-2xl font-bold text-[#191c1e] sm:text-3xl dark:text-white">
              ${(totalDisbursed / 1000000).toFixed(1)}M
            </h3>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-amber-500/5 blur-2xl dark:bg-amber-500/10"></div>
            <div className="mb-3 flex items-start justify-between sm:mb-4">
              <HugeiconsIcon
                icon={Task01Icon}
                className="h-6 w-6 text-amber-600 sm:h-8 sm:w-8"
              />
              <Badge
                variant="secondary"
                className="bg-amber-100 text-[10px] text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              >
                PENDING
              </Badge>
            </div>
            <p className="mb-1 text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
              Pending Applications
            </p>
            <h3 className="text-2xl font-bold text-[#191c1e] sm:text-3xl dark:text-white">
              {pendingLoans.length}
            </h3>
          </CardContent>
        </Card>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Loan Queue */}
        <Card className="overflow-hidden lg:col-span-2">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg sm:text-xl">
              Loan Approval Queue
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                All
              </Button>
              <Button
                size="sm"
                className="bg-[#003d9a] text-xs hover:bg-[#003d9a]/90"
              >
                Pending
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Approved
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 dark:bg-slate-800/50 dark:hover:bg-slate-800/50">
                    <TableHead className="w-[100px] text-[10px] font-black tracking-widest uppercase">
                      ID
                    </TableHead>
                    <TableHead className="text-[10px] font-black tracking-widest uppercase">
                      Borrower
                    </TableHead>
                    <TableHead className="text-[10px] font-black tracking-widest uppercase">
                      Amount
                    </TableHead>
                    <TableHead className="hidden text-[10px] font-black tracking-widest uppercase sm:table-cell">
                      Credit
                    </TableHead>
                    <TableHead className="text-[10px] font-black tracking-widest uppercase">
                      Risk
                    </TableHead>
                    <TableHead className="text-right text-[10px] font-black tracking-widest uppercase">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLoans.map((loan) => (
                    <TableRow
                      key={loan.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <TableCell className="font-bold text-[#1e55be] dark:text-[#b2c5ff]">
                        #{loan.id}
                      </TableCell>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#191c1e] dark:text-white">
                            {loan.borrowerName}
                          </p>
                          <p className="truncate text-xs text-slate-500 capitalize dark:text-slate-400">
                            {loan.type} Loan
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-[#191c1e] dark:text-white">
                        ${loan.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-12 overflow-hidden rounded-full bg-slate-200 sm:w-16 dark:bg-slate-700">
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
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold uppercase ${
                            loan.riskProfile === "low"
                              ? "border-green-500 text-green-700 dark:text-green-400"
                              : loan.riskProfile === "medium"
                                ? "border-amber-500 text-amber-700 dark:text-amber-400"
                                : "border-red-500 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {loan.riskProfile}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {loan.status === "pending" ? (
                          <div className="flex justify-end gap-1 sm:gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 px-2 text-xs hover:bg-green-700 sm:px-3"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="px-2 text-xs sm:px-3"
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <Badge
                            variant="secondary"
                            className={`text-[10px] font-bold uppercase ${
                              loan.status === "approved"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : loan.status === "disbursed"
                                  ? "bg-[#1e55be]/10 text-[#1e55be] dark:bg-[#b2c5ff]/20 dark:text-[#b2c5ff]"
                                  : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                            }`}
                          >
                            {loan.status}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Cards */}
        <div className="space-y-4 sm:space-y-6">
          {/* Portfolio Analytics */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">
                Portfolio Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                  <span className="text-sm font-bold text-green-600">
                    94.5%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liquidity Health */}
          <Card className="bg-gradient-to-br from-[#1e55be] to-[#003d9a] text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-white sm:text-lg">
                  Liquidity Health
                </CardTitle>
                <HugeiconsIcon icon={DropletIcon} className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-1 text-2xl font-bold sm:text-3xl">$1.2M</p>
              <p className="mb-4 text-sm text-white/80">
                Available for disbursement
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-[72%] rounded-full bg-white"></div>
              </div>
              <p className="mt-2 text-xs text-white/60">
                72% of total fund capacity
              </p>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-[#191c1e] dark:text-white">
                      Loan #4390 disbursed
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      5 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#1e55be]"></div>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-[#191c1e] dark:text-white">
                      Application #4401 received
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      2 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-amber-500"></div>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-[#191c1e] dark:text-white">
                      Credit check completed
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      1 hour ago
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
