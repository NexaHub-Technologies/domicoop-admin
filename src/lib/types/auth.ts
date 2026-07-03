export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  full_name: string
  phone: string
  address: string
  bank_name: string
  bank_account: string
  bank_code: string
  avatar_url?: string
  next_of_kin?: string
}

export interface RefreshInput {
  refresh_token: string
}

export interface ResetPasswordInput {
  email: string
}

export interface ConfirmResetInput {
  password: string
}

export interface ResendVerificationInput {
  email: string
}

export interface OAuthGoogleInput {
  id_token: string
  nonce?: string
}

export interface ChangePasswordInput {
  current_password: string
  new_password: string
}

export interface ExpoTokenInput {
  expo_push_token: string
}

// The login/session user (§2) — admins have no member profile, so this is a
// minimal identity, not the full `Member` row.
export interface AuthUser {
  id: string
  email: string
  role: "member" | "admin"
  email_verified?: boolean
  full_name?: string
  avatar_url?: string
}

// Per the API contract (§2), auth endpoints return a FLAT payload —
// tokens live alongside `user`, not nested under a `tokens` key.
export interface AuthResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  user: AuthUser
}

export interface Member {
  id: string
  member_no: string
  email: string
  full_name: string
  phone: string
  address: string
  role: "member" | "admin"
  status: "pending" | "active" | "suspended"
  avatar_url?: string
  bank_name?: string
  bank_account?: string
  bank_code?: string
  next_of_kin?: string
  created_at: string
  updated_at: string
}
