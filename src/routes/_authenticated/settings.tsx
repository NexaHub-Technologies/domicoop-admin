import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockSystemSettings } from "../../lib/mock-data"

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
})

function SettingsPage() {
  const [settings, setSettings] = useState(mockSystemSettings)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-2 block text-xs font-bold tracking-[0.2em] text-[#003d9a] uppercase dark:text-[#b2c5ff]">
            System Configuration
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#191c1e] sm:text-3xl lg:text-4xl dark:text-white">
            Settings
          </h2>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            Reset Changes
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-br from-[#1e55be] to-[#003d9a] text-xs text-white sm:text-sm"
          >
            <span className="material-symbols-outlined mr-1 text-sm">save</span>
            Save Settings
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4 flex h-auto flex-wrap justify-start gap-1 bg-transparent p-0 sm:mb-6 sm:grid sm:w-fit sm:grid-cols-5">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-[#1e55be]/10 data-[state=active]:text-[#1e55be] dark:data-[state=active]:bg-[#1e55be]/20 dark:data-[state=active]:text-[#b2c5ff]"
          >
            <span className="material-symbols-outlined mr-1 text-sm sm:mr-2">
              settings
            </span>
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="data-[state=active]:bg-[#1e55be]/10 data-[state=active]:text-[#1e55be] dark:data-[state=active]:bg-[#1e55be]/20 dark:data-[state=active]:text-[#b2c5ff]"
          >
            <span className="material-symbols-outlined mr-1 text-sm sm:mr-2">
              group
            </span>
            <span className="hidden sm:inline">Members</span>
          </TabsTrigger>
          <TabsTrigger
            value="financial"
            className="data-[state=active]:bg-[#1e55be]/10 data-[state=active]:text-[#1e55be] dark:data-[state=active]:bg-[#1e55be]/20 dark:data-[state=active]:text-[#b2c5ff]"
          >
            <span className="material-symbols-outlined mr-1 text-sm sm:mr-2">
              payments
            </span>
            <span className="hidden sm:inline">Financial</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-[#1e55be]/10 data-[state=active]:text-[#1e55be] dark:data-[state=active]:bg-[#1e55be]/20 dark:data-[state=active]:text-[#b2c5ff]"
          >
            <span className="material-symbols-outlined mr-1 text-sm sm:mr-2">
              security
            </span>
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="data-[state=active]:bg-[#1e55be]/10 data-[state=active]:text-[#1e55be] dark:data-[state=active]:bg-[#1e55be]/20 dark:data-[state=active]:text-[#b2c5ff]"
          >
            <span className="material-symbols-outlined mr-1 text-sm sm:mr-2">
              integration_instructions
            </span>
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                General Configuration
              </CardTitle>
              <CardDescription>
                Configure basic cooperative information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="coop-name">Cooperative Name</Label>
                <Input
                  id="coop-name"
                  value={settings.general.cooperativeName}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      general: {
                        ...settings.general,
                        cooperativeName: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={settings.general.timezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="UTC+1">UTC+1 (West Africa)</SelectItem>
                    <SelectItem value="UTC+2">
                      UTC+2 (Central Africa)
                    </SelectItem>
                    <SelectItem value="UTC+3">UTC+3 (East Africa)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Organization Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 sm:h-16 sm:w-16 dark:bg-slate-800">
                    <span className="material-symbols-outlined text-2xl text-slate-400 sm:text-3xl">
                      image
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    Upload New Logo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Member Rules */}
        <TabsContent value="members" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Member Rules</CardTitle>
              <CardDescription>
                Configure member management policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 sm:p-4 dark:border-slate-700">
                <div>
                  <p className="font-bold text-[#191c1e] dark:text-white">
                    Automatic Approval
                  </p>
                  <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                    Automatically approve new member applications
                  </p>
                </div>
                <Switch
                  checked={settings.memberRules.automaticApproval}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      memberRules: {
                        ...settings.memberRules,
                        automaticApproval: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-fee">Registration Fee ($)</Label>
                <Input
                  id="reg-fee"
                  type="number"
                  value={settings.memberRules.registrationFee}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      memberRules: {
                        ...settings.memberRules,
                        registrationFee: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grace-period">
                  Suspension Grace Period (days)
                </Label>
                <Input
                  id="grace-period"
                  type="number"
                  value={settings.memberRules.suspensionGracePeriod}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      memberRules: {
                        ...settings.memberRules,
                        suspensionGracePeriod: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Protocols */}
        <TabsContent value="financial" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Financial Protocols
              </CardTitle>
              <CardDescription>
                Configure interest rates and contribution tiers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="interest-rate">Base Interest Rate (%)</Label>
                <Input
                  id="interest-rate"
                  type="number"
                  step="0.1"
                  value={settings.financialProtocols.baseInterestRate}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      financialProtocols: {
                        ...settings.financialProtocols,
                        baseInterestRate: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Dividend Distribution Schedule</Label>
                <Select value={settings.financialProtocols.dividendSchedule}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Contribution Thresholds ($)</Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="entry-tier" className="text-xs">
                      Entry Tier
                    </Label>
                    <Input
                      id="entry-tier"
                      type="number"
                      value={
                        settings.financialProtocols.contributionThresholds.entry
                      }
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          financialProtocols: {
                            ...settings.financialProtocols,
                            contributionThresholds: {
                              ...settings.financialProtocols
                                .contributionThresholds,
                              entry: Number(e.target.value),
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="standard-tier" className="text-xs">
                      Standard Tier
                    </Label>
                    <Input
                      id="standard-tier"
                      type="number"
                      value={
                        settings.financialProtocols.contributionThresholds
                          .standard
                      }
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          financialProtocols: {
                            ...settings.financialProtocols,
                            contributionThresholds: {
                              ...settings.financialProtocols
                                .contributionThresholds,
                              standard: Number(e.target.value),
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="premium-tier" className="text-xs">
                      Premium Tier
                    </Label>
                    <Input
                      id="premium-tier"
                      type="number"
                      value={
                        settings.financialProtocols.contributionThresholds
                          .premium
                      }
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          financialProtocols: {
                            ...settings.financialProtocols,
                            contributionThresholds: {
                              ...settings.financialProtocols
                                .contributionThresholds,
                              premium: Number(e.target.value),
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security & Access */}
        <TabsContent value="security" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
                Security & Access
              </CardTitle>
              <CardDescription>
                Configure authentication and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 sm:p-4 dark:border-slate-700">
                <div>
                  <p className="font-bold text-[#191c1e] dark:text-white">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                    Require 2FA for all administrative accounts
                  </p>
                </div>
                <Switch
                  checked={settings.security.twoFactorEnforced}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        twoFactorEnforced: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        sessionTimeout: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="pt-4">
                <h4 className="mb-3 font-bold text-[#191c1e] sm:mb-4 dark:text-white">
                  Administrative Roles
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 sm:p-4 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="material-symbols-outlined text-[#1e55be] dark:text-[#b2c5ff]">
                        shield
                      </span>
                      <div>
                        <p className="font-medium text-[#191c1e] dark:text-white">
                          Super Administrator
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Full system access
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                      2 users
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 sm:p-4 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="material-symbols-outlined text-slate-400">
                        account_balance
                      </span>
                      <div>
                        <p className="font-medium text-[#191c1e] dark:text-white">
                          Financial Auditor
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Read-only financial access
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                      3 users
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Integrations</CardTitle>
              <CardDescription>
                Manage third-party service connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stripe */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 sm:p-4 dark:border-slate-700">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#635BFF] text-xs font-bold text-white sm:h-12 sm:w-12 sm:text-sm">
                    Stripe
                  </div>
                  <div>
                    <p className="font-bold text-[#191c1e] dark:text-white">
                      Stripe
                    </p>
                    <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                      Payment processing
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                  <Button size="icon" variant="ghost">
                    <span className="material-symbols-outlined">settings</span>
                  </Button>
                </div>
              </div>

              {/* Flutterwave */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 sm:p-4 dark:border-slate-700">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5A623] text-xs font-bold text-white sm:h-12 sm:w-12">
                    FW
                  </div>
                  <div>
                    <p className="font-bold text-[#191c1e] dark:text-white">
                      Flutterwave
                    </p>
                    <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                      African payment gateway
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                  <Button size="icon" variant="ghost">
                    <span className="material-symbols-outlined">settings</span>
                  </Button>
                </div>
              </div>

              {/* Data Exports */}
              <div className="pt-4">
                <h4 className="mb-3 font-bold text-[#191c1e] sm:mb-4 dark:text-white">
                  Scheduled Data Exports
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 sm:p-4 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="material-symbols-outlined text-slate-400">
                        schedule
                      </span>
                      <div>
                        <p className="font-medium text-[#191c1e] dark:text-white">
                          Daily Backup
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Every day at 2:00 AM
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-green-600 sm:text-sm">
                      Enabled
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 sm:p-4 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="material-symbols-outlined text-slate-400">
                        assessment
                      </span>
                      <div>
                        <p className="font-medium text-[#191c1e] dark:text-white">
                          Weekly Report
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Every Monday at 8:00 AM
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-green-600 sm:text-sm">
                      Enabled
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
