const ACCESS_TOKEN_KEY = "domicop_access_token"
const REFRESH_TOKEN_KEY = "domicop_refresh_token"

export const session = {
  async getToken(): Promise<string | null> {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  async getRefreshToken(): Promise<string | null> {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  async clearTokens(): Promise<void> {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  async touch(): Promise<void> {
    // no-op in this project; used to update last-activity timestamps
  },
}
