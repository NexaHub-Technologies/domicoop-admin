import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router"
import { useAuth } from "../providers/auth-provider"
import { useTheme } from "../providers/theme-provider"
import { cn } from "../lib/utils"
import { useState } from "react"

// Navigation items - Only 6 main routes
const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "grid_view" },
  { label: "Members", path: "/members", icon: "group" },
  { label: "Contributions", path: "/contributions", icon: "payments" },
  { label: "Loans", path: "/loans", icon: "account_balance" },
  { label: "Communications", path: "/communications", icon: "chat" },
  { label: "Settings", path: "/settings", icon: "settings" },
]

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context }) => {
    // Check authentication
    const auth = context as { auth?: { isAuthenticated: boolean } }
    if (!auth?.auth?.isAuthenticated) {
      throw redirect({ to: "/login" })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const { user, logout } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-['Plus_Jakarta_Sans'] text-[#191c1e] dark:bg-[#060e20] dark:text-white">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile, shown on lg+ */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-64 flex-col gap-2 bg-[#eceef0] p-4 transition-transform duration-300 dark:bg-[#0b1326]",
          "-translate-x-full lg:translate-x-0",
          mobileMenuOpen && "translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center space-x-3 px-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#1e55be] to-[#003d9a] shadow-sm">
            <span className="material-symbols-outlined text-xl text-white">
              account_balance
            </span>
          </div>
          <div>
            <h1 className="text-lg leading-tight font-extrabold text-[#191c1e] dark:text-white">
              Cobalt Archive
            </h1>
            <p className="text-[10px] tracking-widest text-slate-500 uppercase opacity-60 dark:text-slate-400">
              v2.4.0-Architect
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              icon={item.icon}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
          <button className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#1e55be] to-[#003d9a] py-3 font-bold text-white shadow-md transition-transform active:scale-95">
            <span className="material-symbols-outlined text-sm">
              add_circle
            </span>
            New Report
          </button>
          <button
            onClick={logout}
            className="flex w-full items-center space-x-3 px-4 py-2 text-slate-600 transition-all hover:text-[#003d9a] dark:text-slate-400 dark:hover:text-[#b2c5ff]"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Top Navigation - Full width on mobile, offset on lg+ */}
      <header className="fixed top-0 right-0 z-40 flex h-16 w-full items-center justify-between bg-white/80 px-4 py-3 shadow-[0px_12px_32px_rgba(25,28,30,0.06)] backdrop-blur-md lg:w-[calc(100%-256px)] lg:px-8 dark:bg-[#0b1326]/80">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-full p-2 text-slate-500 transition-all hover:bg-slate-100 active:scale-95 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="relative max-w-xl flex-1">
            <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-slate-500 dark:text-slate-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-full border-none bg-slate-100 py-2 pr-4 pl-10 text-sm text-[#191c1e] transition-all placeholder:text-slate-400 focus:ring-1 focus:ring-[#003d9a]/40 sm:w-64 lg:w-full dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-6">
          <div className="flex space-x-1 sm:space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-slate-500 transition-all hover:bg-slate-100 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <span className="material-symbols-outlined text-sm sm:text-base">
                {resolvedTheme === "dark" ? "light_mode" : "dark_mode"}
              </span>
            </button>
            <button className="relative rounded-full p-2 text-slate-500 transition-all hover:bg-slate-100 active:scale-95 dark:text-slate-400 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined text-sm sm:text-base">
                notifications
              </span>
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full border border-white bg-[#9b3e00] sm:h-2 sm:w-2 dark:border-[#0b1326]"></span>
            </button>
            <button className="hidden rounded-full p-2 text-slate-500 transition-all hover:bg-slate-100 active:scale-95 sm:block dark:text-slate-400 dark:hover:bg-slate-800">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
          </div>

          <div className="ml-1 flex items-center space-x-2 sm:ml-2 sm:space-x-3">
            <img
              src={
                user?.avatar ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
              }
              alt="Administrator Profile"
              className="h-7 w-7 rounded-full border border-slate-200 sm:h-8 sm:w-8 dark:border-slate-700"
            />
            <span className="hidden font-bold text-[#191c1e] sm:block dark:text-white">
              {user?.name || "Admin"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-screen overflow-y-auto bg-[#f7f9fb] pt-16 lg:ml-64 dark:bg-[#060e20]">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

// NavLink component
function NavLink({
  to,
  icon,
  children,
  onClick,
}: {
  to: string
  icon: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: false }}
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-200",
        "text-slate-600 dark:text-slate-400",
        "hover:bg-white/50 hover:text-[#003d9a] dark:hover:bg-white/5 dark:hover:text-[#b2c5ff]",
        "[&[data-status='active']]:bg-white [&[data-status='active']]:dark:bg-white/10",
        "[&[data-status='active']]:text-[#003d9a] [&[data-status='active']]:dark:text-[#b2c5ff]",
        "[&[data-status='active']]:shadow-sm",
        "[&[data-status='active']]:border-l-4 [&[data-status='active']]:border-[#003d9a] [&[data-status='active']]:dark:border-[#b2c5ff]",
        "[&[data-status='active']]:translate-x-1"
      )}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span>{children}</span>
    </Link>
  )
}
