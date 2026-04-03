import { createFileRoute } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { TerminalIcon } from "@hugeicons/core-free-icons"

export const Route = createFileRoute("/_authenticated/logs")({
  component: LogsPage,
})

function LogsPage() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center">
      <HugeiconsIcon
        icon={TerminalIcon}
        className="mb-4 h-16 w-16 text-slate-300 dark:text-slate-600"
      />
      <h2 className="mb-2 text-2xl font-bold text-[#191c1e] dark:text-white">
        System Logs
      </h2>
      <p className="text-slate-500 dark:text-slate-400">
        System logs and audit trail coming soon.
      </p>
    </div>
  )
}
