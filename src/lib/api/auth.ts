import { request, authedRequest } from "../http"
import type {
  LoginInput,
  RegisterInput,
  RefreshInput,
  ResetPasswordInput,
  ConfirmResetInput,
  ResendVerificationInput,
  ChangePasswordInput,
  ExpoTokenInput,
  AuthResponse,
} from "../types/auth"

export const authApi = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    return request<AuthResponse>("/v1/auth/login", {
      method: "POST",
      body: data,
    })
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    return request<AuthResponse>("/v1/auth/register", {
      method: "POST",
      body: data,
    })
  },

  refresh: async (data: RefreshInput): Promise<AuthResponse> => {
    return request<AuthResponse>("/v1/auth/refresh", {
      method: "POST",
      body: data,
    })
  },

  logout: async (): Promise<void> => {
    await authedRequest("/v1/auth/logout", { method: "POST" })
  },

  resetPassword: async (data: ResetPasswordInput): Promise<void> => {
    await request("/v1/auth/reset-password", {
      method: "POST",
      body: data,
    })
  },

  confirmReset: async (data: ConfirmResetInput): Promise<void> => {
    await request("/v1/auth/confirm-reset", {
      method: "POST",
      body: data,
    })
  },

  resendVerification: async (data: ResendVerificationInput): Promise<void> => {
    await request("/v1/auth/resend-verification", {
      method: "POST",
      body: data,
    })
  },

  changePassword: async (data: ChangePasswordInput): Promise<void> => {
    await authedRequest("/v1/auth/change-password", {
      method: "POST",
      body: data,
    })
  },

  registerExpoToken: async (data: ExpoTokenInput): Promise<void> => {
    await request("/v1/auth/expo-token", {
      method: "POST",
      body: data,
    })
  },
}
