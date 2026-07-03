import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"
import { getStoredAuth, type StoredAuth } from "./lib/auth-storage"

interface RouterContext {
  auth: StoredAuth
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
