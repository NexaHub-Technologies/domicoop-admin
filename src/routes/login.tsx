import { createFileRoute, redirect, Link, useRouter } from "@tanstack/react-router"
import { useAuth } from "../providers/auth-provider"
import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Mail01Icon,
  LockKeyIcon,
  ViewIcon,
  ViewOffIcon,
  ArrowRight01Icon,
  RefreshIcon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons"
import { AuthLayout, AuthField, authInputCls } from "../components/auth-layout"
import { getStoredAuth } from "../lib/auth-storage"

export const Route = createFileRoute("/login")({
  ssr: false,
  beforeLoad: () => {
    if (getStoredAuth().isAuthenticated) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const result = await login(email, password)
    if (result.ok) {
      router.navigate({ to: "/dashboard" })
    } else {
      setError(result.error ?? "Invalid credentials.")
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to the administration portal."
      footer={
        <p className="text-muted-foreground">
          Admin access is provisioned by an existing administrator — there is no
          public sign-up. Need an account? Ask an admin to add you under{" "}
          <span className="font-medium text-foreground">
            Settings → Administrators
          </span>
          .
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <HugeiconsIcon
              icon={AlertCircleIcon}
              className="mt-0.5 h-4 w-4 shrink-0"
            />
            <span>{error}</span>
          </div>
        )}

        <AuthField label="Email" htmlFor="email">
          <div className="relative">
            <HugeiconsIcon
              icon={Mail01Icon}
              className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@domicop.com"
              required
              className={authInputCls}
            />
          </div>
        </AuthField>

        <AuthField
          label="Password"
          htmlFor="password"
          trailing={
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-[#2f6be0] hover:underline"
            >
              Forgot password?
            </Link>
          }
        >
          <div className="relative">
            <HugeiconsIcon
              icon={LockKeyIcon}
              className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={authInputCls}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <HugeiconsIcon
                icon={showPassword ? ViewOffIcon : ViewIcon}
                className="h-5 w-5"
              />
            </button>
          </div>
        </AuthField>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-border text-[#2f6be0] focus:ring-[#2f6be0]"
          />
          Keep me signed in on this device
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#2f6be0] to-[#003d9a] py-3 text-sm font-semibold text-white shadow-lg shadow-[#2f6be0]/25 transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <HugeiconsIcon icon={RefreshIcon} className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Sign in
              <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  )
}
