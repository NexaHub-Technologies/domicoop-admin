import { Link } from "@tanstack/react-router"
import { Logo } from "./logo"

// The four pillars of the cooperative, rendered as passbook ledger lines.
const PILLARS: { label: string; note: string }[] = [
  { label: "Members", note: "enrolment & standing" },
  { label: "Contributions", note: "monthly savings" },
  { label: "Loans", note: "credit & disbursement" },
  { label: "Dividends", note: "annual surplus" },
]

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_1fr]">
      {/* Brand / ledger panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#071431] px-10 py-12 text-white lg:flex xl:px-16">
        {/* ambient glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#2f6be0]/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#e6a93b]/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <Logo className="h-11 w-11" />
          <div className="leading-tight">
            <p className="font-display text-xl font-semibold tracking-tight">
              DOMICOP
            </p>
            <p className="text-[11px] font-medium tracking-[0.22em] text-white/50 uppercase">
              Cooperative Society
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <div className="mb-5 h-px w-14 bg-[#e6a93b]" />
          <h1 className="font-display text-4xl leading-[1.1] font-medium tracking-tight text-white xl:text-[2.9rem]">
            A cooperative is only as strong as its ledger.
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-white/60">
            The administration portal for members, contributions, loans and
            dividends — kept in balance, on the record.
          </p>

          <ul className="mt-10 space-y-3.5">
            {PILLARS.map((p) => (
              <li key={p.label} className="flex items-baseline gap-3 text-sm">
                <span className="font-medium text-white/90">{p.label}</span>
                <span className="mb-1 flex-1 border-b border-dotted border-white/25" />
                <span className="text-white/45">{p.note}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-[11px] tracking-[0.18em] text-white/35 uppercase">
          © {new Date().getFullYear()} DOMICOP · Secure Portal
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col px-5 py-8 sm:px-8">
        {/* compact brand header on small screens */}
        <div className="mb-10 flex items-center gap-2.5 lg:hidden">
          <Logo className="h-9 w-9" />
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            DOMICOP
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="mx-auto w-full max-w-sm">
            <h2 className="font-display text-3xl font-medium tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

            <div className="mt-8">{children}</div>

            {footer && (
              <div className="mt-8 border-t border-border pt-6 text-sm">
                {footer}
              </div>
            )}
          </div>
        </div>

        <div className="pt-8 text-center text-xs text-muted-foreground">
          <Link to="/privacy" className="hover:text-foreground hover:underline">
            Privacy Policy
          </Link>
        </div>
      </main>
    </div>
  )
}

// Shared field styling for the auth forms.
export function AuthField({
  label,
  htmlFor,
  children,
  trailing,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
  trailing?: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="text-xs font-semibold tracking-wide text-muted-foreground"
        >
          {label}
        </label>
        {trailing}
      </div>
      {children}
    </div>
  )
}

export const authInputCls =
  "w-full rounded-lg border border-border bg-muted/40 py-2.5 pr-4 pl-11 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-[#2f6be0] focus:bg-background focus:ring-2 focus:ring-[#2f6be0]/20"
