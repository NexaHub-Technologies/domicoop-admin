// Admin real-time notifications socket (§12).
// Connect to wss://<host>/v1/ws/notifications?token=<access_token>. On connect
// the server sends { type: "connected", channels }, then { type: "notification" }
// frames for admin-directed events (registrations, tickets, disbursements) and
// the admin's personal channel.

export interface NotificationFrame {
  type: "notification"
  id: string
  notification_type: string
  title: string
  body: string
  data?: Record<string, unknown>
  action?: { label: string; url: string } | null
  timestamp: string
}

interface ConnectedFrame {
  type: "connected"
  channels: string[]
}

type ServerFrame = NotificationFrame | ConnectedFrame | { type: string }

function wsUrlFromApiBase(token: string): string | null {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (!base) return null
  const wsBase = base.replace(/^http/, "ws").replace(/\/$/, "")
  return `${wsBase}/v1/ws/notifications?token=${encodeURIComponent(token)}`
}

export interface NotificationSocketHandlers {
  onNotification: (frame: NotificationFrame) => void
  onConnected?: (channels: string[]) => void
}

// Small reconnecting WebSocket wrapper. `getToken` is called on every (re)connect
// so a refreshed token is picked up automatically.
export class NotificationSocket {
  private ws: WebSocket | null = null
  private closedByUs = false
  private attempt = 0
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null

  constructor(
    private getToken: () => Promise<string | null>,
    private handlers: NotificationSocketHandlers,
  ) {}

  async connect(): Promise<void> {
    if (typeof window === "undefined") return
    this.closedByUs = false
    const token = await this.getToken()
    if (!token) return
    const url = wsUrlFromApiBase(token)
    if (!url) return

    try {
      this.ws = new WebSocket(url)
    } catch {
      this.scheduleReconnect()
      return
    }

    this.ws.onopen = () => {
      this.attempt = 0
    }
    this.ws.onmessage = (event) => {
      let frame: ServerFrame
      try {
        frame = JSON.parse(event.data as string)
      } catch {
        return
      }
      if (frame.type === "notification") {
        this.handlers.onNotification(frame as NotificationFrame)
      } else if (frame.type === "connected") {
        this.handlers.onConnected?.((frame as ConnectedFrame).channels ?? [])
      }
    }
    this.ws.onclose = () => {
      if (!this.closedByUs) this.scheduleReconnect()
    }
    this.ws.onerror = () => {
      // onclose will follow and trigger reconnect
      this.ws?.close()
    }
  }

  private scheduleReconnect(): void {
    if (this.closedByUs || this.reconnectTimer) return
    this.attempt += 1
    // exponential backoff capped at 30s
    const delay = Math.min(1000 * 2 ** this.attempt, 30000)
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      void this.connect()
    }, delay)
  }

  close(): void {
    this.closedByUs = true
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.ws?.close()
    this.ws = null
  }
}
