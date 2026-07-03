import { createFileRoute, redirect } from "@tanstack/react-router"
import { getStoredAuth } from "../lib/auth-storage"

export const Route = createFileRoute("/")({
  ssr: false,
  beforeLoad: () => {
    if (getStoredAuth().isAuthenticated) {
      throw redirect({ to: "/dashboard" })
    } else {
      throw redirect({ to: "/login" })
    }
  },
})
