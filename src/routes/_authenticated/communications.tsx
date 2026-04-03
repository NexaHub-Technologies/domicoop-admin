import { createFileRoute } from "@tanstack/react-router"
import { mockMessages, mockMembers } from "../../lib/mock-data"
import { useState } from "react"

export const Route = createFileRoute("/_authenticated/communications")({
  component: CommunicationsPage,
})

function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<
    "members" | "prospects" | "support"
  >("members")
  const [selectedMessage, setSelectedMessage] = useState(mockMessages[0])
  const [replyText, setReplyText] = useState("")

  const filteredMessages = mockMessages.filter((msg) => msg.type === activeTab)

  return (
    <div className="-mx-8 -mt-8 h-[calc(100vh-140px)]">
      {/* Three Pane Layout */}
      <div className="flex h-full">
        {/* Left Pane: Inbox List */}
        <section className="flex w-[400px] flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0b1326]">
          <div className="p-6 pb-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#191c1e] dark:text-white">
                Messages
              </h2>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e55be]/10 text-[#1e55be] transition-all hover:bg-[#1e55be] hover:text-white dark:bg-[#1e55be]/20 dark:text-[#b2c5ff] dark:hover:bg-[#1e55be]">
                <span className="material-symbols-outlined">edit_square</span>
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="mb-4 flex space-x-1 rounded-xl bg-slate-100 p-1.5 dark:bg-slate-800">
              {(["members", "prospects", "support"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                    activeTab === tab
                      ? "bg-white text-[#1e55be] shadow-sm dark:bg-[#0b1326] dark:text-[#b2c5ff]"
                      : "text-slate-500 hover:text-[#191c1e] dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto">
            {filteredMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`w-full border-b border-slate-100 p-4 text-left transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50 ${
                  selectedMessage?.id === message.id
                    ? "bg-slate-50 dark:bg-slate-800/50"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e55be]/10 text-sm font-bold text-[#1e55be] dark:bg-[#1e55be]/20 dark:text-[#b2c5ff]">
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
                    <div className="mt-2 flex items-center gap-2">
                      {message.unread && (
                        <span className="h-2 w-2 rounded-full bg-[#1e55be]"></span>
                      )}
                      {message.priority === "urgent" && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                          URGENT
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Center Pane: Chat */}
        <section className="flex flex-1 flex-col bg-[#f7f9fb] dark:bg-[#060e20]">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-[#0b1326]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e55be]/10 text-sm font-bold text-[#1e55be] dark:bg-[#1e55be]/20 dark:text-[#b2c5ff]">
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
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 transition-colors hover:text-[#1e55be] dark:hover:text-[#b2c5ff]">
                <span className="material-symbols-outlined">phone</span>
              </button>
              <button className="p-2 text-slate-400 transition-colors hover:text-[#1e55be] dark:hover:text-[#b2c5ff]">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            <div className="flex justify-center">
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                Today
              </span>
            </div>

            {/* Received Message */}
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e55be]/10 text-xs font-bold text-[#1e55be] dark:bg-[#1e55be]/20 dark:text-[#b2c5ff]">
                {selectedMessage?.senderName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="max-w-[70%]">
                <div className="rounded-2xl rounded-tl-none bg-white p-4 shadow-sm dark:bg-[#0b1326]">
                  <p className="text-sm text-[#191c1e] dark:text-white">
                    {selectedMessage?.content}
                  </p>
                </div>
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
            <div className="flex flex-row-reverse items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1e55be] to-[#003d9a]">
                <span className="material-symbols-outlined text-sm text-white">
                  support_agent
                </span>
              </div>
              <div className="max-w-[70%]">
                <div className="rounded-2xl rounded-tr-none bg-[#1e55be] p-4 text-white shadow-sm">
                  <p className="text-sm">
                    Thank you for reaching out. I&apos;ll be happy to help you
                    with that. Let me check your account details.
                  </p>
                </div>
                <span className="mt-1 block text-right text-xs text-slate-400">
                  10:35 AM
                </span>
              </div>
            </div>
          </div>

          {/* Reply Input */}
          <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#0b1326]">
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-400 transition-colors hover:text-[#1e55be] dark:hover:text-[#b2c5ff]">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full rounded-full border-none bg-slate-100 px-4 py-3 text-[#191c1e] focus:ring-2 focus:ring-[#1e55be]/20 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <button className="rounded-full bg-[#1e55be] p-3 text-white transition-colors hover:bg-[#003d9a]">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </section>

        {/* Right Pane: Member Context */}
        <section className="w-[300px] border-l border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-[#0b1326]">
          {selectedMessage?.type === "member" ? (
            <div className="space-y-6">
              {/* Member Profile */}
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#1e55be]/10 text-2xl font-bold text-[#1e55be] dark:bg-[#1e55be]/20 dark:text-[#b2c5ff]">
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
                <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Active Member
                </span>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                  <p className="mb-1 text-xs tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Total Contributions
                  </p>
                  <p className="text-xl font-bold text-[#191c1e] dark:text-white">
                    $12,500
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                  <p className="mb-1 text-xs tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Active Loans
                  </p>
                  <p className="text-xl font-bold text-[#191c1e] dark:text-white">
                    1
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                  <p className="mb-1 text-xs tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Credit Score
                  </p>
                  <p className="text-xl font-bold text-green-600">745</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="mb-3 font-bold text-[#191c1e] dark:text-white">
                  Recent Activity
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-sm text-slate-400">
                      payments
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      Contributed $500
                    </span>
                    <span className="ml-auto text-xs text-slate-400">
                      2d ago
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-sm text-slate-400">
                      account_balance
                    </span>
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
                <button className="w-full rounded-lg bg-[#1e55be] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#003d9a]">
                  View Full Profile
                </button>
                <button className="w-full rounded-lg border border-slate-200 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                  View Loan History
                </button>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">
              <span className="material-symbols-outlined mb-3 text-4xl text-slate-300 dark:text-slate-600">
                info
              </span>
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
