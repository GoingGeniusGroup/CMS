"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { Bell, MessageSquare, Briefcase, FileText, Inbox } from "lucide-react";
import Link from "next/link";
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationRow,
} from "@/app/actions/notifications";
import { useRouter } from "next/navigation";

const TYPE_ICONS: Record<string, { icon: typeof Bell; bg: string; color: string }> = {
  contact_message: { icon: MessageSquare, bg: "bg-indigo-50", color: "text-indigo-500" },
  project_updated: { icon: Briefcase, bg: "bg-amber-50", color: "text-amber-500" },
  career_application: { icon: FileText, bg: "bg-emerald-50", color: "text-emerald-500" },
  lead_received: { icon: Inbox, bg: "bg-sky-50", color: "text-sky-500" },
  invoice_created: { icon: FileText, bg: "bg-rose-50", color: "text-rose-500" },
  general: { icon: Bell, bg: "bg-zinc-100", color: "text-zinc-500" },
};

function timeAgo(date: Date | string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  // Fetch unread count on mount and periodically
  useEffect(() => {
    getUnreadCount().then(setUnreadCount);
    const interval = setInterval(() => {
      getUnreadCount().then(setUnreadCount);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications when panel opens
  useEffect(() => {
    if (open) {
      startTransition(async () => {
        setLoading(true);
        const data = await getNotifications(20);
        setNotifications(data);
        setLoading(false);
      });
    }
  }, [open, startTransition]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }

  async function handleClickNotification(notification: NotificationRow) {
    if (!notification.isRead) {
      await markNotificationRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    if (notification.link) {
      router.push(notification.link);
      setOpen(false);
    }
  }

  return (
    <div ref={panelRef} className="relative">
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-500 shadow-md transition-colors hover:bg-sky-100 sm:h-[55px] sm:w-[55px] sm:rounded-2xl"
      >
        <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Panel Dropdown */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-3 w-[380px] max-h-[520px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl sm:w-[420px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
            <h3 className="text-lg font-bold text-zinc-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <Bell className="h-8 w-8 text-zinc-200" />
                <p className="text-sm text-zinc-400">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-50">
                {notifications.map((notification) => {
                  const typeConfig = TYPE_ICONS[notification.type] || TYPE_ICONS.general;
                  const Icon = typeConfig.icon;
                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => handleClickNotification(notification)}
                      className={`flex w-full items-start gap-4 px-6 py-4 text-left transition-colors hover:bg-zinc-50 ${
                        !notification.isRead ? "bg-indigo-50/30" : ""
                      }`}
                    >
                      {/* Icon */}
                      <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${typeConfig.bg}`}>
                        <Icon className={`h-5 w-5 ${typeConfig.color}`} />
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${!notification.isRead ? "font-bold text-zinc-900" : "font-medium text-zinc-700"}`}>
                          {notification.title}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-400 truncate">
                          {notification.message}
                        </p>
                      </div>

                      {/* Time */}
                      <span className="shrink-0 text-xs text-zinc-400 mt-0.5">
                        {timeAgo(notification.createdAt)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-zinc-100 px-6 py-3 text-center">
              <Link
                href="/settings/notifications"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                View all notifications →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
