import { createFileRoute, Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { Logo } from "../components/logo"

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy · DOMICOP" },
      {
        name: "description",
        content:
          "How the DOMICOP Cooperative Society app collects, uses, protects and shares your personal, financial and device data.",
      },
    ],
  }),
  component: PrivacyPage,
})

// NOTE FOR MAINTAINERS: this is a plain-language policy grounded in what the
// app actually does. Before publishing to an app store, have it reviewed and
// fill the bracketed placeholders (legal entity, registered address, governing
// law, and the contact address) with your society's real details.
const LAST_UPDATED = "3 July 2026"
const CONTACT_EMAIL = "privacy@domicop.com"

const SECTIONS: { id: string; title: string }[] = [
  { id: "overview", title: "Overview" },
  { id: "data-we-collect", title: "Information we collect" },
  { id: "how-we-use", title: "How we use your information" },
  { id: "payments", title: "Payments and bank details" },
  { id: "notifications", title: "Push notifications and device data" },
  { id: "sharing", title: "How we share information" },
  { id: "retention", title: "Data retention" },
  { id: "security", title: "How we protect your data" },
  { id: "your-rights", title: "Your rights and choices" },
  { id: "children", title: "Children's privacy" },
  { id: "changes", title: "Changes to this policy" },
  { id: "contact", title: "Contact us" },
]

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Logo className="h-8 w-8" />
            <span className="font-display text-lg font-semibold tracking-tight">
              DOMICOP
            </span>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2f6be0] hover:underline"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
        <p className="text-xs font-bold tracking-[0.2em] text-[#003d9a] uppercase dark:text-[#b2c5ff]">
          DOMICOP Cooperative Society
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated {LAST_UPDATED}
        </p>

        <p className="mt-6 leading-relaxed text-muted-foreground">
          This policy explains what personal, financial and device information
          the DOMICOP Cooperative Society (&ldquo;DOMICOP&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;) collects through its member app and
          administration portal, why we collect it, how we protect it, and the
          choices you have. It applies to members, prospective members and
          administrators who use our services.
        </p>

        {/* Table of contents */}
        <nav
          aria-label="Contents"
          className="mt-8 rounded-xl border border-border bg-muted/40 p-5"
        >
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            On this page
          </p>
          <ol className="grid gap-1.5 sm:grid-cols-2">
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-foreground hover:text-[#2f6be0] hover:underline"
                >
                  <span className="text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}.
                  </span>{" "}
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <Section id="overview" index={1} title="Overview">
          <P>
            DOMICOP is a cooperative thrift and credit society. To run the
            society we keep an accurate record of each member&apos;s standing —
            their contributions, loans and dividends — and we use trusted
            payment and messaging providers to move money and send updates.
            Handling this information responsibly is central to the trust our
            members place in us.
          </P>
          <P>
            We collect only what we need to operate the society, we do not sell
            your personal data, and we work only with service providers who are
            contractually bound to protect it.
          </P>
        </Section>

        <Section id="data-we-collect" index={2} title="Information we collect">
          <P>We collect the following categories of information:</P>
          <SubHeading>Identity and contact details</SubHeading>
          <List
            items={[
              "Full name, email address and phone number",
              "Residential address",
              "Next-of-kin details you provide",
              "Your member number and membership status",
              "Profile photo, if you add one",
            ]}
          />
          <SubHeading>Financial information</SubHeading>
          <List
            items={[
              "Contribution records (amounts, dates and payment status)",
              "Loan applications, approvals, balances and repayments",
              "Dividend allocations and payouts",
              "Bank account number and bank code, used to verify payments and to disburse loans and dividends to you",
            ]}
          />
          <P>
            We do <strong>not</strong> collect or store full card numbers. Card
            payments are handled directly by our payment processor (see{" "}
            <A href="#payments">Payments and bank details</A>).
          </P>
          <SubHeading>Account and authentication data</SubHeading>
          <List
            items={[
              "Your password, which is stored only in a securely hashed form — we never see it in plain text",
              "Session tokens that keep you signed in",
              "Sign-in metadata such as email verification status and, if you use it, Google sign-in",
            ]}
          />
          <SubHeading>Device and technical data</SubHeading>
          <List
            items={[
              "Device push notification token, and your device platform (iOS or Android) and device name, so we can deliver notifications",
              "Your notification preferences",
              "Technical logs such as IP address, timestamps and error diagnostics used to keep the service secure and reliable",
            ]}
          />
        </Section>

        <Section id="how-we-use" index={3} title="How we use your information">
          <List
            items={[
              "Create and administer your membership and verify your identity",
              "Record and process contributions, loans, repayments and dividends",
              "Send you transaction updates, announcements and support replies",
              "Operate secure sign-in and protect against fraud and unauthorised access",
              "Respond to your support requests",
              "Meet our legal, regulatory and cooperative record-keeping obligations",
            ]}
          />
          <P>
            We rely on your membership agreement, your consent (for example, for
            push notifications), and our legitimate interest in running the
            society securely as the bases for this processing.
          </P>
        </Section>

        <Section id="payments" index={4} title="Payments and bank details">
          <P>
            Contributions, loan disbursements and dividend payouts are processed
            through <strong>Paystack</strong>, our payment and transfer
            provider. When money moves to or from your account, the relevant
            details (such as your bank account number and bank code) are shared
            with Paystack to complete the transfer. Paystack processes this
            information under its own privacy terms and applicable payment-industry
            security standards. We store transaction references and status so
            your society records stay accurate, but we do not store full card
            details.
          </P>
        </Section>

        <Section
          id="notifications"
          index={5}
          title="Push notifications and device data"
        >
          <P>
            If you enable notifications, your device registers a push token with
            us so we can deliver reminders, transaction alerts and announcements
            through the Expo push notification service. We use your token and
            device platform only to route these messages.
          </P>
          <P>
            You can turn notifications off at any time from your device settings
            or within the app&apos;s notification preferences. Turning them off
            stops push messages; you will still see relevant updates inside the
            app.
          </P>
        </Section>

        <Section id="sharing" index={6} title="How we share information">
          <P>
            We do not sell your personal data. We share it only in these
            limited circumstances:
          </P>
          <List
            items={[
              "Service providers who operate the app on our behalf: Supabase (authentication, database and hosting), Paystack (payments and transfers) and Expo (push notification delivery). They may process your data only to provide these services to us.",
              "Legal and regulatory requirements, including cooperative regulators, where we are required or permitted by law to disclose information.",
              "Protecting rights and safety, to prevent fraud or protect the society, our members or the public.",
              "Business changes, such as a merger or reorganisation of the society, in which case we will continue to protect your data under this policy.",
            ]}
          />
        </Section>

        <Section id="retention" index={7} title="Data retention">
          <P>
            We keep your information for as long as you remain a member and for
            as long afterwards as we are required to retain financial and
            cooperative records under applicable law and our own governance
            rules. When information is no longer needed, we delete it or
            irreversibly anonymise it.
          </P>
        </Section>

        <Section id="security" index={8} title="How we protect your data">
          <List
            items={[
              "Data is encrypted in transit between the app and our servers.",
              "Passwords are stored only as salted hashes.",
              "Administrative access is restricted to authorised administrators and is granted individually — never by re-using a member account.",
              "Access to sensitive financial data is limited to what each role needs to do its job.",
            ]}
          />
          <P>
            No system can be guaranteed perfectly secure, but we work
            continuously to protect your information and to respond quickly if an
            issue arises.
          </P>
        </Section>

        <Section id="your-rights" index={9} title="Your rights and choices">
          <P>Depending on where you live, you may have the right to:</P>
          <List
            items={[
              "Access the personal information we hold about you",
              "Correct information that is inaccurate or incomplete",
              "Request deletion of your information, subject to records we must keep by law",
              "Object to or restrict certain processing",
              "Withdraw consent, for example by turning off notifications",
              "Request a copy of your information in a portable format",
            ]}
          />
          <P>
            To exercise any of these rights, contact us using the details below.
            We may need to verify your identity before acting on a request.
          </P>
        </Section>

        <Section id="children" index={10} title="Children's privacy">
          <P>
            The DOMICOP app is intended for members of the cooperative and is not
            directed to children. We do not knowingly collect personal
            information from anyone below the age of membership. If you believe a
            minor has provided us information, please contact us and we will
            delete it.
          </P>
        </Section>

        <Section id="changes" index={11} title="Changes to this policy">
          <P>
            We may update this policy from time to time. When we make material
            changes, we will update the &ldquo;Last updated&rdquo; date above
            and, where appropriate, notify you in the app. Your continued use of
            the service after an update means you accept the revised policy.
          </P>
        </Section>

        <Section id="contact" index={12} title="Contact us">
          <P>
            If you have questions about this policy or how we handle your
            information, contact us at:
          </P>
          <div className="mt-3 rounded-xl border border-border bg-muted/40 p-5 text-sm">
            <p className="font-semibold">DOMICOP Cooperative Society</p>
            <p className="mt-1 text-muted-foreground">
              Email:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[#2f6be0] hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
            <p className="mt-1 text-muted-foreground">
              Registered address: [Registered address]
            </p>
          </div>
        </Section>

        <footer className="mt-14 border-t border-border pt-6 text-xs tracking-[0.16em] text-muted-foreground uppercase">
          © {new Date().getFullYear()} DOMICOP Cooperative Society
        </footer>
      </main>
    </div>
  )
}

function Section({
  id,
  index,
  title,
  children,
}: {
  id: string
  index: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="mt-12 scroll-mt-20">
      <h2 className="font-display text-2xl font-medium tracking-tight">
        <span className="mr-2 text-muted-foreground">
          {String(index).padStart(2, "0")}
        </span>
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="pt-2 text-sm font-semibold tracking-wide text-foreground">
      {children}
    </h3>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="leading-relaxed text-muted-foreground">{children}</p>
}

function A({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a href={href} className="text-[#2f6be0] hover:underline">
      {children}
    </a>
  )
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 leading-relaxed text-muted-foreground">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e6a93b]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
