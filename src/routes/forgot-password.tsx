import { createFileRoute, redirect, Link } from "@tanstack/react-router"
import { useState } from "react"
import { authApi } from "../lib/api/auth"
import { ApiError } from "../lib/http"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Mail01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  RefreshIcon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons"
import { AuthLayout, AuthField, authInputCls } from "../components/auth-layout"
import { getStoredAuth } from "../lib/auth-storage"

export const Route = createFileRoute("/forgot-password")({
  ssr: false,
  beforeLoad: () => {
    if (getStoredAuth().isAuthenticated) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSending(true)
    try {
      await authApi.resetPassword({ email })
      setSent(true)
    } catch (err) {
      // Don't reveal whether the account exists — only surface real
      // connectivity failures; otherwise show the same confirmation.
      if (err instanceof ApiError && err.status === 0) {
        setError("Couldn't reach the server. Check your connection and retry.")
      } else {
        setSent(true)
      }
    } finally {
      setSending(false)
    }
  }

  const backToLogin = (
    <Link
      to="/login"
      className="inline-flex items-center gap-1.5 font-semibold text-[#2f6be0] hover:underline"
    >
      <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
      Back to sign in
    </Link>
  )

  if (sent) {
    return (
      <AuthLayout
        title="Check your inbox"
        subtitle="Reset instructions are on their way."
        footer={backToLogin}
      >
        <div className="flex items-start gap-3 rounded-lg border border-[#e6a93b]/30 bg-[#e6a93b]/10 px-4 py-4">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            className="mt-0.5 h-5 w-5 shrink-0 text-[#b7801f] dark:text-[#e6a93b]"
          />
          <p className="text-sm text-foreground">
            If an account exists for{" "}
            <span className="font-semibold">{email}</span>, we&apos;ve sent a
            link to reset its password. The link expires shortly for your
            security.
          </p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your admin email and we'll send a reset link."
      footer={backToLogin}
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

        <button
          type="submit"
          disabled={sending}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[#2f6be0] to-[#003d9a] py-3 text-sm font-semibold text-white shadow-lg shadow-[#2f6be0]/25 transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? (
            <HugeiconsIcon icon={RefreshIcon} className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Send reset link
              <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  )
}
