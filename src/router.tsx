import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

interface User {
  id: string
  adminId: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface RouterContext {
  auth: {
    isAuthenticated: boolean
    user: User | null
  }
}

const AUTH_STORAGE_KEY = "domicop_auth"

function getStoredAuth(): { isAuthenticated: boolean; user: User | null } {
  if (typeof window === "undefined")
    return { isAuthenticated: false, user: null }
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { isAuthenticated: !!parsed.user, user: parsed.user }
    }
  } catch {}
  return { isAuthenticated: false, user: null }
}

export function getRouter() {
  const storedAuth = getStoredAuth()

  const router = createTanStackRouter({
    routeTree,
    context: {
      auth: storedAuth,
    } as RouterContext,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
