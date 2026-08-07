-- Preserve the existing palette as the light-mode palette, then provide an
-- accessible dark-mode default for every existing installation.
ALTER TABLE "general_settings"
  ADD COLUMN "lightThemeColor" TEXT,
  ADD COLUMN "lightThemeTextColor" TEXT,
  ADD COLUMN "darkThemeColor" TEXT,
  ADD COLUMN "darkThemeTextColor" TEXT;

UPDATE "general_settings"
SET
  "lightThemeColor" = COALESCE(NULLIF("themeColor", ''), '#fe9a00'),
  "lightThemeTextColor" = COALESCE(NULLIF("themeTextColor", ''), '#000000'),
  "darkThemeColor" = '#fbbf24',
  "darkThemeTextColor" = '#18181b';

ALTER TABLE "general_settings"
  ALTER COLUMN "lightThemeColor" SET NOT NULL,
  ALTER COLUMN "lightThemeColor" SET DEFAULT '#fe9a00',
  ALTER COLUMN "lightThemeTextColor" SET NOT NULL,
  ALTER COLUMN "lightThemeTextColor" SET DEFAULT '#000000',
  ALTER COLUMN "darkThemeColor" SET NOT NULL,
  ALTER COLUMN "darkThemeColor" SET DEFAULT '#fbbf24',
  ALTER COLUMN "darkThemeTextColor" SET NOT NULL,
  ALTER COLUMN "darkThemeTextColor" SET DEFAULT '#18181b';
