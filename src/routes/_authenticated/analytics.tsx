import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/analytics")({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center">
      <span className="material-symbols-outlined mb-4 text-6xl text-slate-300 dark:text-slate-600">
        insights
      </span>
      <h2 className="mb-2 text-2xl font-bold text-[#191c1e] dark:text-white">
        Analytics
      </h2>
      <p className="text-slate-500 dark:text-slate-400">
        Detailed analytics and reports coming soon.
      </p>
    </div>
  )
}
