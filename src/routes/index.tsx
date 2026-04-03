import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    const auth = context as { auth?: { isAuthenticated: boolean } }
    if (auth?.auth?.isAuthenticated) {
      throw redirect({ to: "/dashboard" })
    } else {
      throw redirect({ to: "/login" })
    }
  },
})
