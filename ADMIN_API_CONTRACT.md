# DOMICOP Admin API Contract

The contract the admin portal (and any admin client) builds against. Every
endpoint here is live in the server today; shapes are taken from the route
handlers, not aspirational.

---

## 1. Conventions

| Aspect | Value |
| --- | --- |
| Base URL | `https://<api-host>/v1` |
| Auth | `Authorization: Bearer <supabase_access_token>` on every request |
| Content type | `application/json` (except `DELETE`, which has no body) |
| Timestamps | ISO-8601 UTC strings (e.g. `2026-07-03T01:27:38.505Z`) |
| IDs | UUID strings (notification ids are prefixed `ntf_<uuid>`) |
| CORS | Allowed origins: `CLIENT_ADMIN_ORIGIN` env, `http://localhost:3001`, `exp://…` |

### Money units (read carefully — resources are inconsistent)
- **Contributions & transactions** → **kobo** (₦ × 100). A ₦5,000 contribution stores/returns `amount: 500000`. Divide by 100 for display.
- **Loans** (`amount_requested`, `amount_approved`, `balance`, `monthly_repayment`) → **naira**. Do not divide.
- **Dividends** (`/dividends` amounts, and `reports.dividends.total_paid`) → **naira** (the transfer layer multiplies by 100 itself). Do not divide.

This split is a real inconsistency in the current backend, not a documentation
simplification — see the mismatch flagged under `/dividends/preview` (§7).

### Who is an admin
Admin status is the presence of a row in the `admin_profiles` table — **not** a
flag on the member `profiles` table. It is resolved server-side from the bearer
token on every request. Admins have **no** member profile, so member-only
endpoints (`GET /members/me`, `/contributions/me`, etc.) are not meaningful for
admin accounts.

### Error envelope
All errors return `{ "error": string }` with an appropriate status. Validation
failures additionally include `details`:

```json
// 422 Unprocessable Entity
{ "error": "Validation failed", "details": "<which field and why>" }
```

| Status | Meaning |
| --- | --- |
| 400 | Bad request (business rule violated, e.g. revoking yourself) |
| 401 | Missing/invalid/expired token |
| 403 | Authenticated but not an admin (`{ "error": "Admin access required" }`) |
| 404 | Route or resource not found |
| 422 | Body/query failed schema validation |
| 500 | Unhandled server error |

### List responses
Admin list endpoints return `{ "data": [...], "total": <number|null> }`. `total`
is the exact row count for the filter (ignores pagination). Paginate with
`?page=<1-based>&limit=<n>`.

---

## 2. Authentication & session

Admins use the **same** auth endpoints as members. There is no separate admin
login; the difference is that `user.role` comes back `"admin"`.

### `POST /auth/login`
```json
// request
{ "email": "admin@domicop.com", "password": "•••••••••" }
// 200
{
  "access_token": "eyJ…",
  "refresh_token": "…",
  "expires_in": 3600,
  "user": { "id": "uuid", "email": "admin@domicop.com", "role": "admin", "email_verified": true }
}
```
Gate the admin portal on `user.role === "admin"`. (A member logging into the
admin portal authenticates fine but every admin route returns 403.)

- `POST /auth/refresh` → `{ refresh_token }` ⇒ `{ access_token, refresh_token, expires_in }`
- `POST /auth/logout` (Bearer) ⇒ `{ success: true }`
- `POST /auth/change-password` (Bearer) → `{ current_password, new_password }` ⇒ `{ success: true, message }`

---

## 3. Admin management — `/admins`

All routes require an existing admin. **The first admin cannot be created over
HTTP** (there is no admin yet to authorize the call); bootstrap it with
`bun run scripts/create-admin.ts <email> <password> "<full name>" [phone]`.

| Method | Path | Body | Success |
| --- | --- | --- | --- |
| GET | `/admins` | — | `200` array of admins |
| POST | `/admins` | `{ email, password (≥8), full_name (≥2), phone? }` | `201` `{ id, email, full_name }` |
| DELETE | `/admins/:id` | — | `204` no content |

```json
// GET /admins → 200
[
  { "id": "uuid", "full_name": "Jane Admin", "email": "jane@domicop.com",
    "phone": "+234…", "avatar_url": null, "is_super_admin": false,
    "created_at": "2026-07-03T…Z" }
]
```

Revoke (`DELETE /admins/:id`) deletes the underlying auth user (cascades the
`admin_profiles` row). You cannot revoke yourself → `400 { "error": "You cannot
revoke your own admin access" }`. Unknown id → `404`.

---

## 4. Members administration — `/members`

Routes below are admin-only (the `/me*` routes on this prefix are member-facing
and not part of the admin portal).

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/members?page&limit` | List all profiles, newest first. ⇒ `{ data, total, page, limit }` |
| GET | `/members/:id` | Full profile row |
| POST | `/members` | Admin-create a member account |
| PATCH | `/members/:id` | Update `status` and/or `member_no` |
| GET | `/members/applications/pending` | Profiles with `status = "pending"`, oldest first |
| POST | `/members/:id/approve` | Approve: sets `status="active"`, assigns `member_no`, notifies the member |
| GET | `/members/:id/statement?year=` | Financial statement (profile + contributions + loans + transactions for the year) |

```json
// POST /members → 200
// request
{ "email": "m@x.com", "password": "•••••••••", "full_name": "New Member",
  "phone": "+234…", "address": "12 Road", "next_of_kin": "…?" }
{ "message": "Registration submitted. Proceed to onboarding.", "id": "uuid" }

// PATCH /members/:id  (role is intentionally NOT accepted here)
{ "status": "active" | "pending" | "suspended", "member_no": "DOMICOP-0007" }
```
> Granting admin is done via `POST /admins`, never by editing a member's role.

`POST /members/:id/approve` assigns `member_no` as `DOMICOP-####` (zero-padded
running count of active members) and returns the updated profile.

---

## 5. Contributions administration — `/contributions`

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/contributions?page&limit&status&member_id&year` | List all contributions (joins `profiles(full_name, member_no)`). ⇒ `{ data, total }` |
| PATCH | `/contributions/:id/status` | Review outcome. Notifies the member unless status is `pending` |

```json
// PATCH /contributions/:id/status
{ "status": "success" | "failed" | "abandoned" | "pending" }
// → 200 updated contribution row
```
`status` filter on the list matches `payment_status`. Setting `success`
recomputes the shares/social/savings/deposit allocation. Amounts are kobo.

> Members submit paid contributions via `POST /contributions/verify` (server
> verifies with Paystack). Admin confirmation here is the manual fallback.

---

## 6. Loans administration — `/loans`

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/loans?page&limit&status` | List all loans (joins `profiles(full_name, member_no)`). ⇒ `{ data, total }` |
| PATCH | `/loans/:id/process` | Approve / reject / review a loan application |
| POST | `/loans/:id/disburse` | Disburse an approved loan via Paystack transfer |

```json
// PATCH /loans/:id/process
{
  "status": "approved" | "rejected" | "under_review" | "disbursed",
  "amount_approved": 20000,     // naira; used only when approving
  "interest_rate": 5,           // percent; default 5
  "tenure_months": 12,          // required when approving
  "admin_notes": "…?"
}
// → 200 updated loan. On approve the server computes monthly_repayment,
//   balance (= principal × (1 + rate/100)), and due_date, and notifies the member.
```

`POST /loans/:id/disburse` (loan must be `approved` with a positive
`amount_approved`):
```json
// 200 success
{ "success": true, "status": "disbursed", "paystack_transfer_ref": "LOAN-…", "disbursed_at": "…Z", "message": "Loan disbursed successfully" }
// 200 awaiting Paystack OTP
{ "success": true, "status": "pending_otp", "paystack_transfer_ref": "LOAN-…", "message": "…" }
// 200 failed
{ "success": false, "status": "disbursement_failed", "message": "…" }
```
Final disbursement state is confirmed asynchronously by the Paystack
`transfer.success` / `transfer.failed` webhook, which notifies admins.

---

## 7. Dividends — `/dividends`

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/dividends?year=` | List dividends for the year (joins profile) |
| POST | `/dividends/preview` | Compute a proportional distribution (no writes) |
| POST | `/dividends/distribute` | Execute transfers for the supplied splits |

```json
// POST /dividends/preview
{ "year": 2026, "total_amount": 100000 }    // pool to share, in NAIRA
// → 200
{ "year": 2026, "total_amount": 100000, "total_members": 12,
  "grand_total_contributions": 8500000,     // ⚠ kobo (from contributions table)
  "preview": [ { "member_id": "uuid", "full_name": "…", "member_no": "DOMICOP-0001",
                 "contribution_amount": 500000,   // ⚠ kobo
                 "dividend_amount": 5882 } ] }     // naira

// POST /dividends/distribute
{ "year": 2026, "dividends": [ { "member_id": "uuid", "amount": 5882 } ] }   // naira
// → 200 per-member outcome
{ "results": [ { "member_id": "uuid", "status": "processing", "transfer_code": "TRF_…" } ] }
//   status is "processing" | "failed" (failed items carry "error")
```
Distribution amounts are **naira**. `dividend_amount` (naira) is correct as an
input to `/distribute`, but `contribution_amount` and `grand_total_contributions`
in the same preview payload are **kobo** (read straight from the contributions
table) — do not compare them to `dividend_amount` without converting. Distribute
is not transactional; inspect each `results[]` entry.

---

## 8. Announcements — `/announcements`

`GET /announcements` (latest 3 published) is **public**. The rest are admin-only.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/announcements/all` | Every announcement (joins author) |
| POST | `/announcements` | Create; if `published:true`, broadcasts to all active members |
| PATCH | `/announcements/:id` | Update; broadcasts on the unpublished→published transition |
| DELETE | `/announcements/:id` | Delete ⇒ `{ success: true }` |

```json
// POST /announcements
{ "title": "AGM 2026", "body": "…(≥10 chars)…", "published": true }
// → 200 created row
// PATCH accepts any subset of { title, body, published }
```
Publishing sends a `meeting`-type notification (in-app + push) to every active
member.

---

## 9. Support messages — `/messages`

Member-facing: `GET /messages/me`, `POST /messages`, `POST /messages/:id/reply`.
Admin-only:

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/messages?status=` | All tickets (joins profile + replies), newest activity first |
| POST | `/messages/:id/reply` | Admin reply (notifies the member) — shared route, admins may reply to any thread |
| PATCH | `/messages/:id/status` | `{ status: "open" \| "in_progress" \| "resolved" \| "closed" }` |

Ticket `status` lifecycle: a member reply reopens to `open`; an admin reply
moves it to `in_progress`; admins set `resolved`/`closed` explicitly.

---

## 10. Notifications & broadcast — `/notifications`

Admins consume the same personal inbox as members (`GET /notifications/me`,
`PATCH /notifications/:id/read`, `POST /notifications/me/read-all`,
`DELETE /notifications/me`, `GET/PATCH /notifications/preferences`,
`POST/POST /notifications/devices[/unregister]`) — see `NOTIFICATION_SYSTEM.md`.
Admin-only sending:

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/notifications/broadcast` | Send an in-app + push notification to members |
| POST | `/notifications/push/test` | Send a raw Expo push to one token (diagnostics; creates no inbox row) |

```json
// POST /notifications/broadcast
{
  "title": "Reminder",
  "body": "Contributions due Friday",
  "type": "loan" | "contribution" | "dividend" | "security" | "meeting",   // default "meeting"
  "member_ids": ["uuid", "…"],          // optional; omit → all active members
  "data": { "any": "string map" },      // optional
  "action": { "label": "View", "url": "/contributions" }   // optional in-app path
}
// → 200 { "sent": <number delivered> }

// POST /notifications/push/test
{ "to": "ExponentPushToken[…]", "title": "Hi", "body": "Test",
  "data": {}, "sound": "default", "priority": "high" }
// → 200 (raw Expo push receipt)
```

---

## 11. Reports — `/reports`

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/reports/summary?year=` | Aggregate financial + membership summary |

```json
// GET /reports/summary → 200
{
  "year": 2026,
  "summary": { "total_members": 0, "active_members": 0, "pending_members": 0 },
  "contributions": { "total": 0, "count": 0, "pending": 0 },      // total in kobo
  "loans": { "total_requested": 0, "total_approved": 0, "total_outstanding": 0, "count": 0, "active": 0 },  // naira
  "transactions": { "total_revenue": 0, "count": 0 },            // kobo
  "dividends": { "total_paid": 0, "count": 0 }                   // naira
}
```

---

## 12. Real-time (admin WebSocket)

Connect to `wss://<api-host>/v1/ws/notifications?token=<access_token>` (browsers
can't set headers, so pass the token as a query param; a Bearer header also
works). On connect the server replies:

```json
{ "type": "connected", "channels": ["admin-notifications", "user-<id>"] }
```

Admins are auto-subscribed to `admin-notifications` (admin-directed events: new
registrations, new/updated support tickets, disbursement outcomes, reversals)
**and** their personal `user-<id>` channel. Event frames:

```json
{ "type": "notification", "id": "ntf_<uuid>", "notification_type": "security",
  "title": "New support ticket", "body": "…", "data": { … },
  "action": { "label": "…", "url": "/messages" } | null,
  "timestamp": "…Z" }
```

---

## 13. Notes for implementers

- **Single source of admin truth** is `admin_profiles`; never infer admin status
  from a member profile.
- **Bootstrap ordering**: create the first admin with the seed script before the
  admin portal can do anything.
- **Amount units are inconsistent across resources** (§1). Treat contributions/
  transactions/dividends as kobo and loans as naira; do not "normalize" blindly.
- **Broadcast reach**: `member_ids` omitted ⇒ all `status = "active"` members;
  tokenless members still receive the in-app inbox row and WebSocket frame, just
  no push.
- **Long-running money ops** (`/loans/:id/disburse`, `/dividends/distribute`)
  return an initiated/partial state; the authoritative outcome arrives via the
  Paystack webhook. Reflect "processing" in the UI and reconcile on webhook.
