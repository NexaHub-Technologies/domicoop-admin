import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react"
import { notificationsApi } from "../lib/api/notifications"
import { session } from "../lib/session"
import { NotificationSocket, type NotificationFrame } from "../lib/ws"
import { useAuth } from "./auth-provider"

export interface LiveNotification {
  id: string
  title: string
  body: string
  type: string
  read: boolean
  created_at: string
  action?: { label: string; url: string } | null
}

interface NotificationsContextType {
  notifications: LiveNotification[]
  unreadCount: number
  markAllRead: () => Promise<void>
  refresh: () => Promise<void>
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined)

const MAX_ITEMS = 30

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<LiveNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const socketRef = useRef<NotificationSocket | null>(null)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const res = await notificationsApi.getMyNotifications({ limit: MAX_ITEMS })
      setNotifications(
        res.data.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          type: n.type ?? "meeting",
          read: n.read,
          created_at: n.created_at,
          action: null,
        })),
      )
      setUnreadCount(res.meta?.unread_count ?? res.data.filter((n) => !n.read).length)
    } catch {
      // inbox is best-effort; live frames still work
    }
  }, [isAuthenticated])

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
    try {
      await notificationsApi.markAllRead()
    } catch {
      // revert count on failure by re-fetching
      refresh()
    }
  }, [refresh])

  useEffect(() => {
    if (!isAuthenticated) {
      socketRef.current?.close()
      socketRef.current = null
      setNotifications([])
      setUnreadCount(0)
      return
    }

    refresh()

    const onNotification = (frame: NotificationFrame) => {
      setNotifications((prev) =>
        [
          {
            id: frame.id,
            title: frame.title,
            body: frame.body,
            type: frame.notification_type,
            read: false,
            created_at: frame.timestamp,
            action: frame.action ?? null,
          },
          ...prev,
        ].slice(0, MAX_ITEMS),
      )
      setUnreadCount((c) => c + 1)
    }

    const socket = new NotificationSocket(() => session.getToken(), {
      onNotification,
    })
    socketRef.current = socket
    void socket.connect()

    return () => {
      socket.close()
      socketRef.current = null
    }
  }, [isAuthenticated, refresh])

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, markAllRead, refresh }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (ctx === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider",
    )
  }
  return ctx
}
