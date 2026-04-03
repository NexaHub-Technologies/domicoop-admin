import { createFileRoute } from "@tanstack/react-router"
import { mockMessages } from "../../lib/mock-data"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Edit01Icon,
  ArrowLeft01Icon,
  InformationCircleIcon,
  TelephoneIcon,
  MoreVerticalIcon,
  CustomerService01Icon,
  Attachment01Icon,
  SentIcon,
  BankIcon,
  MoneySend01Icon,
} from "@hugeicons/core-free-icons"

export const Route = createFileRoute("/_authenticated/communications")({
  component: CommunicationsPage,
})

function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<
    "members" | "prospects" | "support"
  >("members")
  const [selectedMessage, setSelectedMessage] = useState(mockMessages[0])
  const [replyText, setReplyText] = useState("")
  const [mobileView, setMobileView] = useState<"inbox" | "chat" | "context">(
    "inbox"
  )

  const filteredMessages = mockMessages.filter((msg) => msg.type === activeTab)

  return (
    <div className="-mx-4 -mt-4 h-[calc(100vh-100px)] sm:-mx-6 sm:-mt-6 sm:h-[calc(100vh-120px)] lg:-mx-8 lg:-mt-8 lg:h-[calc(100vh-140px)]">
      {/* Three Pane Layout */}
      <div className="flex h-full">
        {/* Left Pane: Inbox List - Hidden on mobile when viewing chat */}
        <section
          className={cn(
            "flex flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0b1326]",
            "w-full lg:w-[350px] xl:w-[400px]",
            mobileView !== "inbox" && "hidden lg:flex"
          )}
        >
          <div className="p-4 pb-2 sm:p-6 sm:pb-4">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <h2 className="text-xl font-extrabold tracking-tight text-[#191c1e] sm:text-2xl dark:text-white">
                Messages
              </h2>
              <Button size="icon" variant="outline" className="rounded-full">
                <HugeiconsIcon icon={Edit01Icon} className="h-5 w-5" />
              </Button>
            </div>

            {/* Filter Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as typeof activeTab)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="members" className="text-xs sm:text-sm">
                  Members
                </TabsTrigger>
                <TabsTrigger value="prospects" className="text-xs sm:text-sm">
                  Prospects
                </TabsTrigger>
                <TabsTrigger value="support" className="text-xs sm:text-sm">
                  Support
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => {
                  setSelectedMessage(message)
                  setMobileView("chat")
                }}
                className={cn(
                  "w-full border-b border-slate-100 p-3 text-left transition-colors hover:bg-slate-50 sm:p-4 dark:border-slate-700 dark:hover:bg-slate-800/50",
                  selectedMessage?.id === message.id &&
                    "bg-slate-50 dark:bg-slate-800/50"
                )}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#1e55be]/10 text-xs font-bold text-[#1e55be] sm:h-10 sm:w-10 sm:text-sm dark:bg-[#1e55be]/20 dark:text-[#b2c5ff]">
                    {message.senderName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="truncate font-bold text-[#191c1e] dark:text-white">
                        {message.senderName}
                      </p>
                      <span className="text-xs text-slate-400">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="truncate text-sm text-slate-600 dark:text-slate-400">
                      {message.content}
                    </p>
                    <div className="mt-1 flex items-center gap-2 sm:mt-2">
                      {message.unread && (
                        <span className="h-2 w-2 rounded-full bg-[#1e55be]"></span>
                      )}
                      {message.priority === "urgent" && (
                        <Badge variant="destructive" className="text-[10px]">
                          URGENT
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Center Pane: Chat - Hidden on mobile when viewing inbox */}
        <section
          className={cn(
            "flex flex-1 flex-col bg-[#f7f9fb] dark:bg-[#060e20]",
            mobileView !== "chat" && "hidden lg:flex"
          )}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6 sm:py-4 dark:border-slate-700 dark:bg-[#0b1326]">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Back button on mobile */}
              <Button
                size="icon"
                variant="ghost"
                className="lg:hidden"
                onClick={() => setMobileView("inbox")}
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
              </Button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e55be]/10 text-xs font-bold text-[#1e55be] sm:h-10 sm:w-10 sm:text-sm dark:bg-[#1e55be]/20 dark:text-[#b2c5ff]">
                {selectedMessage?.senderName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="font-bold text-[#191c1e] dark:text-white">
                  {selectedMessage?.senderName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedMessage?.type === "member"
                    ? "Member"
                    : selectedMessage?.type === "prospect"
                      ? "Prospective Member"
                      : "System Support"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Show context button on mobile */}
              <Button
                size="icon"
                variant="ghost"
                className="lg:hidden"
                onClick={() => setMobileView("context")}
              >
                <HugeiconsIcon
                  icon={InformationCircleIcon}
                  className="h-5 w-5"
                />
              </Button>
              <Button size="icon" variant="ghost">
                <HugeiconsIcon icon={TelephoneIcon} className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost">
                <HugeiconsIcon icon={MoreVerticalIcon} className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:space-y-4 sm:p-6">
            <div className="flex justify-center">
              <Badge variant="secondary">Today</Badge>
            </div>

            {/* Received Message */}
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1e55be]/10 text-xs font-bold text-[#1e55be] sm:h-8 sm:w-8 dark:bg-[#1e55be]/20 dark:text-[#b2c5ff]">
                {selectedMessage?.senderName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="max-w-[80%] sm:max-w-[70%]">
                <Card className="rounded-2xl rounded-tl-none border-none shadow-sm">
                  <CardContent className="p-3 sm:p-4">
                    <p className="text-sm text-[#191c1e] dark:text-white">
                      {selectedMessage?.content}
                    </p>
                  </CardContent>
                </Card>
                <span className="mt-1 block text-xs text-slate-400">
                  {new Date(
                    selectedMessage?.timestamp || ""
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Reply Message */}
            <div className="flex flex-row-reverse items-start gap-2 sm:gap-3">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1e55be] to-[#003d9a] sm:h-8 sm:w-8">
                <HugeiconsIcon
                  icon={CustomerService01Icon}
                  className="h-4 w-4 text-white"
                />
              </div>
              <div className="max-w-[80%] sm:max-w-[70%]">
                <Card className="rounded-2xl rounded-tr-none border-none bg-[#1e55be] shadow-sm">
                  <CardContent className="p-3 sm:p-4">
                    <p className="text-sm text-white">
                      Thank you for reaching out. I&apos;ll be happy to help you
                      with that. Let me check your account details.
                    </p>
                  </CardContent>
                </Card>
                <span className="mt-1 block text-right text-xs text-slate-400">
                  10:35 AM
                </span>
              </div>
            </div>
          </div>

          {/* Reply Input */}
          <div className="border-t border-slate-200 bg-white p-3 sm:p-4 dark:border-slate-700 dark:bg-[#0b1326]">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button size="icon" variant="ghost" className="flex-shrink-0">
                <HugeiconsIcon icon={Attachment01Icon} className="h-5 w-5" />
              </Button>
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your message..."
                  className="rounded-full border-none bg-slate-100 pr-4 pl-4 focus-visible:ring-2 focus-visible:ring-[#1e55be]/20 dark:bg-slate-800"
                />
              </div>
              <Button
                size="icon"
                className="flex-shrink-0 rounded-full bg-[#1e55be] hover:bg-[#003d9a]"
              >
                <HugeiconsIcon icon={SentIcon} className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Right Pane: Member Context - Hidden on mobile and tablet */}
        <section
          className={cn(
            "flex w-[280px] flex-col border-l border-slate-200 bg-white p-4 xl:w-[300px] xl:p-6 dark:border-slate-700 dark:bg-[#0b1326]",
            mobileView !== "context" && "hidden xl:flex"
          )}
        >
          {/* Back button on mobile */}
          <Button
            variant="ghost"
            className="mb-4 self-start xl:hidden"
            onClick={() => setMobileView("chat")}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-2 h-4 w-4" />
            Back to chat
          </Button>

          {selectedMessage?.type === "member" ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Member Profile */}
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#1e55be]/10 text-xl font-bold text-[#1e55be] sm:h-20 sm:w-20 sm:text-2xl dark:bg-[#1e55be]/20 dark:text-[#b2c5ff]">
                  {selectedMessage.senderName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3 className="font-bold text-[#191c1e] dark:text-white">
                  {selectedMessage.senderName}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Member since 2021
                </p>
                <Badge className="mt-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Active Member
                </Badge>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <Card className="bg-slate-50 dark:bg-slate-800/50">
                  <CardContent className="p-3 sm:p-4">
                    <p className="mb-1 text-xs tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Total Contributions
                    </p>
                    <p className="text-lg font-bold text-[#191c1e] sm:text-xl dark:text-white">
                      $12,500
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-50 dark:bg-slate-800/50">
                  <CardContent className="p-3 sm:p-4">
                    <p className="mb-1 text-xs tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Active Loans
                    </p>
                    <p className="text-lg font-bold text-[#191c1e] sm:text-xl dark:text-white">
                      1
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-50 dark:bg-slate-800/50">
                  <CardContent className="p-3 sm:p-4">
                    <p className="mb-1 text-xs tracking-wider text-slate-500 uppercase dark:text-slate-400">
                      Credit Score
                    </p>
                    <p className="text-lg font-bold text-green-600 sm:text-xl">
                      745
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="mb-2 font-bold text-[#191c1e] sm:mb-3 dark:text-white">
                  Recent Activity
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 text-sm sm:gap-3">
                    <HugeiconsIcon
                      icon={MoneySend01Icon}
                      className="h-4 w-4 text-slate-400"
                    />
                    <span className="text-slate-600 dark:text-slate-400">
                      Contributed $500
                    </span>
                    <span className="ml-auto text-xs text-slate-400">
                      2d ago
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:gap-3">
                    <HugeiconsIcon
                      icon={BankIcon}
                      className="h-4 w-4 text-slate-400"
                    />
                    <span className="text-slate-600 dark:text-slate-400">
                      Loan payment
                    </span>
                    <span className="ml-auto text-xs text-slate-400">
                      1w ago
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button className="w-full bg-[#1e55be] hover:bg-[#003d9a]">
                  View Full Profile
                </Button>
                <Button variant="outline" className="w-full">
                  View Loan History
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">
              <HugeiconsIcon
                icon={InformationCircleIcon}
                className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600"
              />
              <p className="text-slate-500 dark:text-slate-400">
                Select a member conversation to see their details
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
