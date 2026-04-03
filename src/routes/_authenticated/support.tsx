import { createFileRoute } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Book01Icon,
  Chatting01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons"

export const Route = createFileRoute("/_authenticated/support")({
  component: SupportPage,
})

function SupportPage() {
  return (
    <div className="space-y-8">
      <div>
        <span className="mb-2 block text-xs font-bold tracking-[0.2em] text-[#003d9a] uppercase dark:text-[#b2c5ff]">
          Help Center
        </span>
        <h2 className="text-4xl font-extrabold tracking-tight text-[#191c1e] dark:text-white">
          Support
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
          <HugeiconsIcon
            icon={Book01Icon}
            className="mb-4 h-8 w-8 text-[#1e55be] dark:text-[#b2c5ff]"
          />
          <h3 className="mb-2 font-bold text-[#191c1e] dark:text-white">
            Documentation
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Browse our comprehensive documentation and guides.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
          <HugeiconsIcon
            icon={Chatting01Icon}
            className="mb-4 h-8 w-8 text-[#1e55be] dark:text-[#b2c5ff]"
          />
          <h3 className="mb-2 font-bold text-[#191c1e] dark:text-white">
            Live Chat
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Get instant help from our support team.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#0b1326]">
          <HugeiconsIcon
            icon={Mail01Icon}
            className="mb-4 h-8 w-8 text-[#1e55be] dark:text-[#b2c5ff]"
          />
          <h3 className="mb-2 font-bold text-[#191c1e] dark:text-white">
            Email Support
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Send us an email at support@domicop.com
          </p>
        </div>
      </div>
    </div>
  )
}
