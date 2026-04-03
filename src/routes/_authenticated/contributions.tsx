import { createFileRoute } from "@tanstack/react-router"
import {
  mockLoans,
  mockMembers,
  mockRecentContributions,
} from "../../lib/mock-data"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Download04Icon,
  MoneySend01Icon,
  CalculatorIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"

export const Route = createFileRoute("/_authenticated/contributions")({
  component: ContributionsPage,
})

function ContributionsPage() {
  const [dividendMode, setDividendMode] = useState<
    "proportional" | "equal" | "tenure"
  >("proportional")
  const pendingLoans = mockLoans.filter((loan) => loan.status === "pending")

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-2 block text-xs font-bold tracking-[0.2em] text-[#003d9a] uppercase dark:text-[#b2c5ff]">
            Financial Processing
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#191c1e] sm:text-3xl lg:text-4xl dark:text-white">
            Contributions & Dividends
          </h2>
        </div>
        <Button variant="outline" className="self-start sm:self-auto">
          <HugeiconsIcon icon={Download04Icon} className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2 xl:gap-8">
        {/* Left Column: Loan Approval Queue */}
        <div className="space-y-4 sm:space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Loan Approval Queue
              </CardTitle>
              <CardDescription>
                Review and approve pending loan applications
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50 dark:divide-slate-700">
                {pendingLoans.map((loan) => (
                  <div
                    key={loan.id}
                    className="p-4 transition-colors hover:bg-slate-50 sm:p-6 dark:hover:bg-slate-800/50"
                  >
                    <div className="mb-3 flex items-start justify-between sm:mb-4">
                      <div>
                        <p className="mb-1 text-xs font-bold text-[#003d9a] dark:text-[#b2c5ff]">
                          REQ #{loan.id}
                        </p>
                        <h5 className="text-base font-bold text-[#191c1e] sm:text-lg dark:text-white">
                          ${loan.amount.toLocaleString()}.00
                        </h5>
                        <p className="text-sm text-slate-500 capitalize dark:text-slate-400">
                          {loan.type} Loan
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-black uppercase ${
                          loan.riskProfile === "low"
                            ? "border-green-500 text-green-700 dark:text-green-400"
                            : loan.riskProfile === "medium"
                              ? "border-amber-500 text-amber-700 dark:text-amber-400"
                              : "border-red-500 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {loan.riskProfile} Risk
                      </Badge>
                    </div>

                    <div className="mb-3 flex items-center gap-3 sm:mb-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 sm:h-10 sm:w-10 dark:bg-slate-700 dark:text-slate-400">
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

                    <p className="mb-3 text-sm text-slate-600 sm:mb-4 dark:text-slate-400">
                      <span className="font-medium">Purpose:</span>{" "}
                      {loan.purpose}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-[#003d9a] text-xs hover:bg-[#002d7a] sm:text-sm"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs sm:text-sm"
                      >
                        Review
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1 text-xs sm:text-sm"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Contributions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Recent Contributions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {mockRecentContributions.map((contribution) => (
                  <div
                    key={contribution.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e55be]/10 sm:h-10 sm:w-10 dark:bg-[#1e55be]/20">
                        <HugeiconsIcon
                          icon={MoneySend01Icon}
                          className="h-4 w-4 text-[#1e55be] dark:text-[#b2c5ff]"
                        />
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
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Dividend Engine */}
        <div className="space-y-4 sm:space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={CalculatorIcon}
                  className="h-5 w-5 text-[#1e55be] dark:text-[#b2c5ff]"
                />
                <div>
                  <CardTitle className="text-lg sm:text-xl">
                    Dividend Engine
                  </CardTitle>
                  <CardDescription>
                    Calculate and distribute surplus to members
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Calculation Modes */}
              <RadioGroup
                value={dividendMode}
                onValueChange={(value) =>
                  setDividendMode(value as typeof dividendMode)
                }
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 rounded-xl border border-slate-200 p-3 transition-colors hover:border-[#1e55be]/50 has-[[data-state=checked]]:border-[#1e55be] has-[[data-state=checked]]:bg-[#1e55be]/5 sm:p-4 dark:border-slate-700 dark:has-[[data-state=checked]]:bg-[#1e55be]/10">
                  <RadioGroupItem
                    value="proportional"
                    id="proportional"
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="proportional"
                      className="font-bold text-[#191c1e] dark:text-white"
                    >
                      Proportional to Contributions
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Distribute based on member contribution history
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 rounded-xl border border-slate-200 p-3 transition-colors hover:border-[#1e55be]/50 has-[[data-state=checked]]:border-[#1e55be] has-[[data-state=checked]]:bg-[#1e55be]/5 sm:p-4 dark:border-slate-700 dark:has-[[data-state=checked]]:bg-[#1e55be]/10">
                  <RadioGroupItem value="equal" id="equal" className="mt-1" />
                  <div className="flex-1">
                    <Label
                      htmlFor="equal"
                      className="font-bold text-[#191c1e] dark:text-white"
                    >
                      Equal Distribution
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Equal amount for all active members
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 rounded-xl border border-slate-200 p-3 transition-colors hover:border-[#1e55be]/50 has-[[data-state=checked]]:border-[#1e55be] has-[[data-state=checked]]:bg-[#1e55be]/5 sm:p-4 dark:border-slate-700 dark:has-[[data-state=checked]]:bg-[#1e55be]/10">
                  <RadioGroupItem value="tenure" id="tenure" className="mt-1" />
                  <div className="flex-1">
                    <Label
                      htmlFor="tenure"
                      className="font-bold text-[#191c1e] dark:text-white"
                    >
                      Tenure Based Bonus
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Reward long-standing members
                    </p>
                  </div>
                </div>
              </RadioGroup>

              {/* Total Amount Input */}
              <div>
                <Label
                  htmlFor="dividend-pool"
                  className="mb-2 block text-sm font-medium"
                >
                  Total Dividend Pool
                </Label>
                <div className="relative">
                  <span className="absolute top-1/2 left-4 -translate-y-1/2 font-bold text-slate-500">
                    $
                  </span>
                  <Input
                    id="dividend-pool"
                    type="number"
                    defaultValue="50000"
                    className="pl-10 font-bold"
                  />
                </div>
              </div>

              {/* Calculate Button */}
              <Button className="w-full bg-gradient-to-br from-[#1e55be] to-[#003d9a]">
                <HugeiconsIcon icon={CalculatorIcon} className="mr-2 h-4 w-4" />
                Calculate Distribution
              </Button>
            </CardContent>
          </Card>

          {/* Payables Preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base sm:text-lg">
                Payables Preview
              </CardTitle>
              <span className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                1,284 members
              </span>
            </CardHeader>
            <CardContent>
              <div className="max-h-48 space-y-2 overflow-y-auto sm:max-h-64 sm:space-y-3">
                {mockMembers.slice(0, 5).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50 p-2 sm:p-3 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 sm:h-8 sm:w-8 dark:bg-slate-700 dark:text-slate-400">
                        {member.initials}
                      </div>
                      <p className="truncate text-sm font-medium text-[#191c1e] dark:text-white">
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
              <Button variant="outline" className="mt-4 w-full">
                View All Payables
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="ml-2 h-4 w-4"
                />
              </Button>
            </CardContent>
          </Card>

          {/* Admin Activity Ledger */}
          <Card className="bg-slate-100 dark:bg-[#0b1326]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">
                Admin Activity Ledger
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Dividend calculation #1284
                  </span>
                  <span className="text-slate-400">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Loan disbursement #4390
                  </span>
                  <span className="text-slate-400">5 hours ago</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Member contribution batch processed
                  </span>
                  <span className="text-slate-400">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
