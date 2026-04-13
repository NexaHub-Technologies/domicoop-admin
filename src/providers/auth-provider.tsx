import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react"

interface User {
  id: string
  adminId: string
  name: string
  email: string
  role: "super_admin" | "financial_auditor" | "admin"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (adminId: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data
const MOCK_USER: User = {
  id: "admin-001",
  adminId: "ADMIN001",
  name: "Co-op Admin",
  email: "admin@domicop.com",
  role: "super_admin",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
}

const AUTH_STORAGE_KEY = "domicop_auth"

function getStoredAuth(): { user: User | null } {
  if (typeof window === "undefined") return { user: null }
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return { user: null }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const { user: storedUser } = getStoredAuth()
    setUser(storedUser)
    setIsLoading(false)
  }, [])

  const login = useCallback(
    async (adminId: string, password: string): Promise<boolean> => {
      setIsLoading(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Mock authentication - accept any admin ID with password "password"
      if (adminId && password === "password") {
        const userWithId = { ...MOCK_USER, adminId }
        setUser(userWithId)
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ user: userWithId })
        )
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
