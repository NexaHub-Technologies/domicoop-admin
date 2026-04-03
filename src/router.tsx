import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

// Define the context type
interface RouterContext {
  auth: {
    isAuthenticated: boolean
    user: {
      id: string
      adminId: string
      name: string
      email: string
      role: string
      avatar?: string
    } | null
  }
}

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: {
      auth: {
        isAuthenticated: false,
        user: null,
      },
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
