-- Site-wide default theme for the public client (system | light | dark),
-- controlled by admins from General Settings.
ALTER TABLE "general_settings"
  ADD COLUMN "clientThemeMode" TEXT NOT NULL DEFAULT 'system';