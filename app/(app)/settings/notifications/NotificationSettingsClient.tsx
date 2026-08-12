"use client";

import { useState } from "react";
import {
  Bell,
  MessageSquare,
  Briefcase,
  FileText,
  Inbox,
  Trash2,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/Card";
import {
  saveNotificationSettings,
  markAllNotificationsRead,
  clearAllNotifications,
  deleteNotification,
  markNotificationRead,
  type NotificationSettingsData,
  type NotificationRow,
} from "@/app/actions/notifications";

const TYPE_ICONS: Record<string, { icon: typeof Bell; bg: string; color: string }> = {
  contact_message: { icon: MessageSquare, bg: "bg-indigo-50", color: "text-indigo-500" },
  project_updated: { icon: Briefcase, bg: "bg-amber-50", color: "text-amber-500" },
  career_application: { icon: FileText, bg: "bg-emerald-50", color: "text-emerald-500" },
  lead_received: { icon: Inbox, bg: "bg-sky-50", color: "text-sky-500" },
  invoice_created: { icon: FileText, bg: "bg-rose-50", color: "text-rose-500" },
  general: { icon: Bell, bg: "bg-zinc-100", color: "text-zinc-500" },
};

const SETTING_LABELS: { key: keyof NotificationSettingsData; label: string; description: string; icon: typeof Bell }[] = [
  { key: "contactMessage", label: "Contact Messages", description: "When someone sends a message via the contact form", icon: MessageSquare },
  { key: "projectUpdated", label: "Project Updates", description: "When a project is created or updated", icon: Briefcase },
  { key: "careerApplication", label: "Career Applications", description: "When someone applies for a job", icon: FileText },
  { key: "leadReceived", label: "New Leads", description: "When a new lead is captured", icon: Inbox },
  { key: "invoiceCreated", label: "Invoice Activity", description: "When an invoice is created", icon: FileText },
];

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

export function NotificationSettingsClient({
  initialSettings,
  initialNotifications,
}: {
  initialSettings: NotificationSettingsData;
  initialNotifications: NotificationRow[];
}) {
  const [settings, setSettings] = useState<NotificationSettingsData>(initialSettings);
  const [notifications, setNotifications] = useState<NotificationRow[]>(initialNotifications);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function notify(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleToggle(key: keyof NotificationSettingsData) {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    setIsSaving(true);
    const result = await saveNotificationSettings(next);
    setIsSaving(false);
    if (result.success) {
      notify("success", "Settings updated");
    } else {
      setSettings(settings); // revert
      notify("error", result.error || "Failed to save");
    }
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    notify("success", "All notifications marked as read");
  }

  async function handleClearAll() {
    await clearAllNotifications();
    setNotifications([]);
    notify("success", "All notifications cleared");
  }

  async function handleDelete(id: string) {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  async function handleRead(id: string) {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm sm:px-6 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
              <Bell className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-base font-bold text-amber-500 sm:text-lg">Notifications</h1>
              <p className="text-xs text-zinc-500">Manage notification preferences and view history.</p>
            </div>
          </div>
          {isSaving && <Loader2 className="ml-auto h-4 w-4 animate-spin text-amber-500" />}
        </div>
      </div>

      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm ${
          message.type === "success"
            ? "border border-green-200 bg-green-50 text-green-700"
            : "border border-red-200 bg-red-50 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* Notification Preferences */}
      <Card>
        <h2 className="text-base font-bold text-zinc-900">Notification Preferences</h2>
        <p className="mt-1 text-xs text-zinc-500">Choose which events trigger notifications.</p>
        <div className="mt-5 divide-y divide-zinc-100">
          {SETTING_LABELS.map(({ key, label, description, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-50">
                  <Icon className="h-4 w-4 text-zinc-500" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-zinc-800">{label}</p>
                  <p className="text-xs text-zinc-400">{description}</p>
                </div>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={() => handleToggle(key)}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-zinc-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full" />
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Notification History */}
      <Card noPadding>
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900">
              All Notifications
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                  {unreadCount} unread
                </span>
              )}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear all
              </button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Bell className="h-10 w-10 text-zinc-200" />
            <p className="text-sm text-zinc-400">No notifications yet</p>
            <p className="text-xs text-zinc-300">Notifications will appear here when events occur.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {notifications.map((notification) => {
              const typeConfig = TYPE_ICONS[notification.type] || TYPE_ICONS.general;
              const Icon = typeConfig.icon;
              return (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 px-6 py-4 ${!notification.isRead ? "bg-indigo-50/30" : ""}`}
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
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-300">
                      {timeAgo(notification.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1">
                    {!notification.isRead && (
                      <button
                        type="button"
                        onClick={() => handleRead(notification.id)}
                        className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
                        title="Mark as read"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(notification.id)}
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
