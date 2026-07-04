// Single source of truth for the persisted admin identity. The router context
// gate (__root.tsx / router.tsx) and the AuthProvider both read/write through
// here so they never drift apart.

export const AUTH_STORAGE_KEY = "domicoop_auth"

// Minimal admin identity we keep in localStorage. The login response (§2) is
// `{ id, email, role, email_verified }`; `name`/`avatar_url` are derived/optional
// and only used for the header chrome.
export interface AdminUser {
  id: string
  email: string
  role: string
  name: string
  avatar_url?: string
}

export interface StoredAuth {
  isAuthenticated: boolean
  user: AdminUser | null
}

export function getStoredAuth(): StoredAuth {
  if (typeof window === "undefined")
    return { isAuthenticated: false, user: null }
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as { user?: AdminUser | null }
      return { isAuthenticated: !!parsed.user, user: parsed.user ?? null }
    }
  } catch {}
  return { isAuthenticated: false, user: null }
}

export function setStoredUser(user: AdminUser): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user }))
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

// Derive a display name from a login user that has no profile name of its own.
export function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ")
}
