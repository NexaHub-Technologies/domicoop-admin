import { useTheme } from "../providers/theme-provider"

export function Logo({ className = "" }: { className?: string }) {
  const { resolvedTheme } = useTheme()

  return (
    <img
      src={resolvedTheme === "dark" ? "/dark-logo.png" : "/light-logo.png"}
      alt="DOMICOP"
      className={className}
    />
  )
}
