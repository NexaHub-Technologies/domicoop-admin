import { createFileRoute, redirect } from "@tanstack/react-router"
import { useAuth } from "../providers/auth-provider"
import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  HelpCircleIcon,
  InformationCircleIcon,
  BankIcon,
  UserIcon,
  LockIcon,
  ViewIcon,
  SecurityIcon,
  Login01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"
import { useRouter } from "@tanstack/react-router"

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    const auth = context as { auth?: { isAuthenticated: boolean } }
    if (auth?.auth?.isAuthenticated) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [adminId, setAdminId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(adminId, password)
    if (success) {
      router.navigate({ to: "/dashboard" })
    } else {
      setError('Invalid credentials. Try password: "password"')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f9fb] dark:bg-[#060e20]">
      {/* Top Navigation */}
      <header className="flex w-full items-center justify-between bg-transparent px-8 py-6 text-[#003d9a] dark:text-[#b2c5ff]">
        <div className="text-xl font-bold tracking-tight">
          Financial Archive
        </div>
        <div className="flex items-center gap-6">
          <button className="text-[#191c1e] transition-colors duration-200 hover:text-[#1e55be] dark:text-white dark:hover:text-[#b2c5ff]">
            <HugeiconsIcon icon={HelpCircleIcon} className="h-6 w-6" />
          </button>
          <button className="text-[#191c1e] transition-colors duration-200 hover:text-[#1e55be] dark:text-white dark:hover:text-[#b2c5ff]">
            <HugeiconsIcon icon={InformationCircleIcon} className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex grow items-center justify-center px-4 py-12">
        <div className="flex w-full max-w-110 flex-col gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-[#e0e3e5] dark:bg-[#1e293b]">
              <HugeiconsIcon
                icon={BankIcon}
                className="h-8 w-8 text-[#1e55be] dark:text-[#b2c5ff]"
              />
            </div>
            <h1 className="text-[1.5rem] font-bold tracking-tight text-[#191c1e] dark:text-white">
              DOMICOP Administration
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Secure portal for financial data management and archival
              oversight.
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-xl bg-white p-8 shadow-[0px_12px_32px_rgba(25,28,30,0.06)] dark:border dark:border-slate-700 dark:bg-[#0b1326] dark:shadow-none">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Admin ID Field */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Admin ID
                </label>
                <div className="relative">
                  <HugeiconsIcon
                    icon={UserIcon}
                    className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="Enter identification number"
                    className="w-full rounded-lg border-none bg-[#f7f9fb] py-4 pr-4 pl-12 text-[#191c1e] transition-all duration-200 outline-none focus:bg-white focus:ring-2 focus:ring-[#1e55be]/20 dark:bg-[#060e20] dark:text-white dark:focus:bg-[#0b1326]"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs font-semibold text-[#1e55be] hover:underline dark:text-[#b2c5ff]"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <HugeiconsIcon
                    icon={LockIcon}
                    className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border-none bg-[#f7f9fb] py-4 pr-12 pl-12 text-[#191c1e] transition-all duration-200 outline-none focus:bg-white focus:ring-2 focus:ring-[#1e55be]/20 dark:bg-[#060e20] dark:text-white dark:focus:bg-[#0b1326]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <HugeiconsIcon icon={ViewIcon} className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-center text-sm text-red-500">{error}</div>
              )}

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded border-slate-300 text-[#1e55be] focus:ring-[#1e55be]"
                />
                <label className="ml-3 cursor-pointer text-slate-600 select-none dark:text-slate-400">
                  Remember this device
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-br from-[#003d9a] to-[#1e55be] py-4 font-bold text-white shadow-lg transition-all duration-200 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <HugeiconsIcon
                    icon={RefreshIcon}
                    className="h-5 w-5 animate-spin"
                  />
                ) : (
                  <>
                    Sign In
                    <HugeiconsIcon icon={Login01Icon} className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security Notice */}
          <div className="flex items-center justify-center gap-3 rounded-lg bg-[#f0f2f5] px-6 py-4 dark:bg-[#0b1326]">
            <HugeiconsIcon
              icon={SecurityIcon}
              className="h-5 w-5 text-[#1e55be] dark:text-[#b2c5ff]"
            />
            <p className="text-[0.6875rem] leading-relaxed tracking-widest text-slate-500 uppercase dark:text-slate-400">
              End-to-End Encrypted Session
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 flex w-full flex-col items-center justify-between bg-transparent px-8 py-4 text-[0.6875rem] tracking-wider text-slate-500 uppercase md:flex-row">
        <div>© 2024 Financial Archive System. Secure Portal.</div>
        <div className="mt-4 flex gap-6 md:mt-0">
          <a
            href="#"
            className="hover:text-[#003d9a] hover:underline dark:hover:text-[#b2c5ff]"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-[#003d9a] hover:underline dark:hover:text-[#b2c5ff]"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="hover:text-[#003d9a] hover:underline dark:hover:text-[#b2c5ff]"
          >
            Security Whitepaper
          </a>
        </div>
      </footer>
    </div>
  )
}
