"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export type NotificationType =
  | "contact_message"
  | "project_updated"
  | "career_application"
  | "lead_received"
  | "invoice_created"
  | "general";

export type NotificationRow = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: Date;
};

// ─── Read ────────────────────────────────────────────────────────────────────

export async function getNotifications(limit = 20): Promise<NotificationRow[]> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  return prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getUnreadCount(): Promise<number> {
  const session = await auth();
  if (!session?.user) return 0;

  return prisma.notification.count({ where: { isRead: false } });
}

// ─── Write ───────────────────────────────────────────────────────────────────

export async function markNotificationRead(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  await prisma.notification.update({ where: { id }, data: { isRead: true } });
  return { success: true };
}

export async function markAllNotificationsRead() {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  await prisma.notification.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });
  return { success: true };
}

export async function deleteNotification(id: string) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  await prisma.notification.delete({ where: { id } });
  return { success: true };
}

export async function clearAllNotifications() {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  await prisma.notification.deleteMany();
  return { success: true };
}

// ─── Create (called internally by other actions) ─────────────────────────────

/**
 * Creates a notification if the corresponding notification setting is enabled.
 * No auth check — this is called server-side from other actions that already
 * verified authorization.
 */
export async function createNotification(data: {
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}) {
  // Check if this notification type is enabled in settings
  const settings = await getNotificationSettings();
  const typeToSettingKey: Record<NotificationType, keyof typeof settings> = {
    contact_message: "contactMessage",
    project_updated: "projectUpdated",
    career_application: "careerApplication",
    lead_received: "leadReceived",
    invoice_created: "invoiceCreated",
    general: "contactMessage", // general always allowed
  };

  const settingKey = typeToSettingKey[data.type];
  if (data.type !== "general" && !settings[settingKey]) return;

  await prisma.notification.create({
    data: {
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link,
    },
  });
}

// ─── Notification Settings ───────────────────────────────────────────────────

export type NotificationSettingsData = {
  contactMessage: boolean;
  projectUpdated: boolean;
  careerApplication: boolean;
  leadReceived: boolean;
  invoiceCreated: boolean;
};

const SETTINGS_DEFAULTS: NotificationSettingsData = {
  contactMessage: true,
  projectUpdated: true,
  careerApplication: true,
  leadReceived: true,
  invoiceCreated: true,
};

export async function getNotificationSettings(): Promise<NotificationSettingsData> {
  const row = await prisma.notificationSetting.findFirst();
  if (!row) return SETTINGS_DEFAULTS;
  return {
    contactMessage: row.contactMessage,
    projectUpdated: row.projectUpdated,
    careerApplication: row.careerApplication,
    leadReceived: row.leadReceived,
    invoiceCreated: row.invoiceCreated,
  };
}

export async function saveNotificationSettings(data: NotificationSettingsData) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const existing = await prisma.notificationSetting.findFirst();
  if (existing) {
    await prisma.notificationSetting.update({ where: { id: existing.id }, data });
  } else {
    await prisma.notificationSetting.create({ data });
  }
  return { success: true };
}
