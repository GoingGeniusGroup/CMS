# Project-wide Light and Dark Theme Implementation Plan

## Goal

Add a complete, accessible light/dark theme system across the CMS:

- Public website, authenticated admin application, login/onboarding, shared overlays, and rich-text output all respond to the active theme.
- **General Settings** manages separate brand and text colors for both modes.
- Each visitor/admin can select Light, Dark, or System preference. The choice is remembered locally; System follows the operating system.
- Existing settings remain valid after release, with safe defaults and no visual flash while the application loads.

This document is implementation planning only. No source code or database changes are included here.

## Current-state findings

| Area | Current implementation | Gap to address |
| --- | --- | --- |
| Global CSS | `app/globals.css` explicitly sets `color-scheme: light` and light `--background` / `--foreground` values. `dark:` is configured but never activated. | Replace the forced light-only foundation with semantic light and dark tokens. |
| General Settings | `GeneralSetting` currently persists one `themeColor` and one `themeTextColor`; `GeneralSettingsClient` has a single color editor and contrast recommendation. | Persist and edit a distinct theme/background color and on-theme text color for each mode. |
| Public brand theming | `(user)/layout.tsx` mounts `ThemeProvider`; it writes CSS overrides for indigo/purple classes. | Make provider mode-aware and mount a common theme controller high enough to serve public, admin, and auth routes. |
| Admin UI | `(app)/layout.tsx`, `Sidebar`, shared cards, forms, and pages use fixed light colors such as `bg-white`, `text-zinc-*`, and `bg-[#f5f3f3]`. | Convert all surfaces and states to semantic token utilities. |
| Public UI | Public pages and shared components also contain fixed light neutral colors and some literal white foregrounds. | Convert pages/components to semantic tokens and preserve intentional image/media overlays. |
| Theme preference | No switch, persisted user preference, or system preference listener exists. | Add an accessible selector and prevent hydration/theme flash. |

There are currently roughly 3,350 occurrences of hard-coded neutral/background/text utility styles in `app/` and `components/`, so the work must be done systematically rather than by adding a few global overrides.

## Product and UX decisions

### Theme modes and selection

Use three preferences:

1. **System** (default): use `prefers-color-scheme`.
2. **Light**: always use light mode.
3. **Dark**: always use dark mode.

Persist the preference in `localStorage` under a dedicated, versioned key (for example `cms-theme-preference`). Apply the resolved mode by placing `light` or `dark` on the root `<html>` element. Do not store an individual’s UI preference in `GeneralSetting`; that record controls site-wide palette defaults, while the preference is personal/device-specific.

Place the selector in:

- the public navbar (desktop and mobile),
- the admin desktop/sidebar or top-level header and mobile header,
- auth screens where practical.

Use an icon plus an accessible label/menu, keyboard support, visible focus state, and `aria-pressed`/radio semantics. The UI must state the selected preference rather than only showing a sun/moon icon.

### Color settings in General Settings

Retain the existing meaning of “theme color”: it is the primary brand/accent color used for solid calls to action, focused controls, links, selected navigation, and related tokens. Add four explicit fields:

| Setting shown to admin | Suggested stored field | Purpose |
| --- | --- | --- |
| Light Theme Color | `lightThemeColor` | Light-mode primary brand color. |
| Light Text Color | `lightThemeTextColor` | Foreground placed on a solid light-mode theme color. |
| Dark Theme Color | `darkThemeColor` | Dark-mode primary brand color; can differ to meet contrast on dark surfaces. |
| Dark Text Color | `darkThemeTextColor` | Foreground placed on a solid dark-mode theme color. |

Recommended compatibility approach: retain `themeColor` and `themeTextColor` during the rollout as legacy aliases, backfill `lightThemeColor` / `lightThemeTextColor` from them, and make the application read the new fields. Once all deployed environments have migrated and exports/imports are updated, schedule a separate breaking-cleanup migration to remove legacy fields. This minimizes risk to current database records and config imports.

Defaults should be intentional and accessible (for example, retain the current orange/black pairing for light mode and choose a slightly brighter orange/white pairing for dark mode). Final values must be confirmed against contrast checks rather than assumed from color names.

The General Settings form should group fields into “Light theme” and “Dark theme” cards. Each group includes color picker, validated hex input, independent “use recommended text color” action, contrast status/ratio, and a compact preview rendered with that group’s values. A full page preview should also show page surface, muted text, button, form control, selected nav item, alert, card, and focus indicator under both modes.

## Technical design

### 1. Establish semantic design tokens

Define stable token names in `app/globals.css` for both mode-specific values. Tokens should describe purpose rather than a concrete color. Initial token set:

- Page and elevated surfaces: `--color-page`, `--color-surface`, `--color-surface-raised`, `--color-surface-sunken`.
- Text: `--color-text`, `--color-text-muted`, `--color-text-subtle`, `--color-text-inverse`.
- Borders and inputs: `--color-border`, `--color-border-strong`, `--color-input`, `--color-input-placeholder`.
- Brand: `--color-primary`, `--color-primary-hover`, `--color-on-primary`, `--color-primary-subtle`, `--color-primary-border`.
- Interaction and status: `--color-focus-ring`, `--color-link`, plus semantic success/warning/danger/info surface/text/border tokens.
- Special content: code, editor, table header, tooltip/popover, modal backdrop, skeleton, scrollbar, and image-overlay tokens.

Set light defaults on `:root`/`.light` and dark defaults on `.dark`. Set `color-scheme: light dark` globally and `color-scheme: light` or `dark` for each resolved root mode so browser-native controls render correctly.

Create reusable semantic utilities/components instead of relying on selectors that rewrite arbitrary Tailwind class names at runtime. Examples include `bg-[var(--color-surface)]`, `text-[var(--color-text)]`, and shared classes such as `ui-card`, `ui-input`, `ui-button-primary`, and `ui-focus-ring` where repetition is high. Maintain a concise token-to-usage guide in CSS comments or a companion developer document.

### 2. Introduce a client theme controller without flash

Create a small client `ThemeProvider`/context responsible for preference state, resolved mode, updates to `<html>`, storage, and listening to OS theme changes while preference is System.

Add a minimal inline, CSP-compatible root-layout bootstrap script that reads the saved preference and applies `light`/`dark` before paint. It must safely fall back to System if storage is unavailable. Keep server-rendered HTML predictable and use `suppressHydrationWarning` only for the expected root-class difference.

Consolidate the current public-only `components/ThemeProvider.tsx` with this controller, or split it clearly into:

- `ThemeModeProvider` for preference/resolved mode;
- `BrandThemeVariables` for server-delivered configured palette variables.

The brand variables must expose both configured palettes, with mode token rules selecting the correct values. Do not inject unsanitized CSS: validate all stored color values server-side before interpolating them into style output, and use defaults for invalid values.

Mount the shared system from `app/layout.tsx` so `(user)`, `(app)`, and `(auth)` all receive it. Remove the duplicate public-only mount after migration. Keep public settings retrieval cached/tag-invalidated as it is today.

### 3. Data model, validation, caching, and configuration transfer

1. Add nullable/new defaulted light/dark palette columns to `GeneralSetting` via Prisma schema and a forward-only migration.
2. Backfill every existing row: copy `themeColor` to `lightThemeColor` and `themeTextColor` to `lightThemeTextColor`; set dark fields to vetted defaults (or a documented transformed palette), without overwriting nonempty new values.
3. Update `prisma/seed-settings.ts` with all four fields; ensure regular seed behavior does not unexpectedly erase customized production settings.
4. Extend `GeneralSettingInput`, `getGeneralSettings`, `saveGeneralSettings`, `SiteSettings`, default values, and `getSiteSettings` to carry the four fields.
5. Validate all colors in the server action with a strict hex parser; reject malformed values, normalize acceptable shorthand if supported, and enforce a documented contrast minimum for each theme-color/on-theme-text pair. Reuse/extend `lib/color-contrast.ts` to calculate a WCAG contrast ratio, not only choose black/white.
6. Invalidate the existing `site-settings` cache tag after successful save. Confirm that all layouts and metadata use the updated cached shape safely.
7. Extend `app/actions/config-transfer.ts` export/import schema and validation so palette settings round-trip. Define backward-compatible import behavior for exports that contain only legacy fields.
8. Update any tests, fixtures, seed helpers, generated Prisma client workflow, and documentation that construct `GeneralSetting` data.

### 4. Convert shared primitives first

Inventory and migrate the highest-reuse components before individual pages:

- App shell: `app/(app)/layout.tsx`, `Sidebar`, `MobileHeader`, top bar/actions, Settings navigation, `Card`, tables, pagination, empty states, loading states, and dialogs.
- Inputs: text fields, selects, checkboxes, switches, file/image uploaders, date controls, editor toolbar, and validation/error/success messages.
- Overlay/content primitives: modals, dropdowns, tooltips, popovers, toast/banner/cookie popup, `StatusBadge`, and invoice print styles where screen styling applies.
- Public shared UI: `LandingNavbar`, footer, `TopBanner`, `CookieBanner`, `SitePopup`, dynamic-page components, cards, and motion components.
- Rich content: `.tiptap` rules (blockquote, inline code, table, headings, separators, placeholder), renderer output, and syntax code blocks.

For each primitive, replace fixed neutral foreground/background/border colors with semantic tokens. Preserve semantic status colors but give each appropriate light and dark surface/border/foreground token. Preserve intentionally fixed white/black content only when it is over an image/video/brand surface and it passes contrast; annotate these exceptions where not obvious.

### 5. Migrate route groups and pages in controlled batches

After shared primitives are stable, migrate and review each route group:

1. `(auth)`: login and onboarding.
2. `(app)`: dashboard, all CRUD pages, invoices/print, settings—including General Settings and Appearance—and loading/error/empty states.
3. `(user)`: home, company/about, services/detail, projects/portfolio/detail, blogs/article, teams, career/apply, contact/thank-you, dynamic `[slug]` pages.
4. API-independent components used inside those routes.

Use the existing hard-coded color inventory as a checklist. Search for `bg-white`, `text-black`, `text-white`, `bg-[#`, and `zinc`/`gray`/`slate` color utilities after each batch. Convert only theme-sensitive uses; leave data visualization/status palette colors with documented contrast checks.

Do not rely on broad CSS attribute selectors that override all Tailwind colors: they cause unpredictable nested component, hover, and accessibility regressions. Prefer explicit semantic utilities/components, supplemented by narrowly scoped compatibility rules only during migration.

### 6. Preserve branding behavior and evolve Appearance Settings

Clarify responsibility:

- General Settings owns both mode palettes and their on-brand text colors.
- Appearance Settings continues to own hover behavior and timezone. Update its “base color” guidance to show the active/light/dark values, or remove the obsolete read-only base-color presentation if it no longer adds value.
- `baseColorEnabled` becomes a documented master switch: when disabled, use neutral/default primary tokens consistently for both modes. Decide whether it should hide palette editors or leave them editable for later activation, then implement that behavior consistently.

Derive hover/subtle/border variants from each current mode’s configured primary color using a tested color utility (rather than appending hex alpha blindly where unsupported or inappropriate). Ensure buttons, focus rings, selected nav states, gradient accents, and primary links all use these variables.

## Accessibility, quality, and edge cases

- Meet WCAG 2.1 AA contrast: 4.5:1 for normal text, 3:1 for large text and non-text UI indicators. Validate configured primary/on-primary pairs at save time and show the ratio in the form.
- Check all default semantic foreground/background pairs in both modes, including muted text, placeholders, disabled controls, borders, focus rings, statuses, charts/badges, and overlays.
- Ensure `:focus-visible` is evident on every interactive control in both modes.
- Respect `prefers-reduced-motion`; mode transitions should be absent or extremely short and never delay readability.
- Ensure browser color schemes affect scrollbars/native controls as intended; test Chromium, Firefox, and Safari.
- Test initial load, hard refresh, client navigation, System switching while the app is open, localStorage unavailable, invalid legacy settings, and switching after a settings save.
- Verify custom admin palette values cannot make vital UI unreadable; provide inline error/recommendation and do not save invalid combinations.

## Verification plan

### Automated

1. Unit-test color parsing, contrast-ratio calculation, recommendations, defaults, and invalid-value fallbacks in `lib/color-contrast`.
2. Unit-test theme preference resolution for Light, Dark, System, media-query changes, and storage failures.
3. Test General Settings validation and save/get mapping, migration backfill logic where testable, cache invalidation, and config export/import compatibility.
4. Add component tests for theme selector accessibility and rendered root class/variables.
5. Run TypeScript, ESLint, existing Vitest suite, Prisma validation/generation, and production build.

### Manual visual and functional QA

Run a two-mode matrix across desktop and narrow mobile widths for:

- public header/navigation, footer, home, list/detail pages, forms, popup, cookie banner, dynamic pages, and rich text;
- login/onboarding;
- admin shell, collapsed/mobile sidebar, dashboard, tables, all form controls, dialogs, invoices, each settings page, errors, empty/loading states;
- configured default palettes plus at least one custom light/dark palette pair.

Capture before/after screenshots for representative pages. Check that no white flashes, illegible icons, invisible borders, or unthemed modal/dropdown portals remain. Perform keyboard-only and screen-reader spot checks of the selector and General Settings form.

## Delivery sequence and checkpoints

1. **Foundation:** confirm visual token names/default palettes; add theme controller, root bootstrap, semantic CSS, and selector shell behind tests.
2. **Persistence:** deliver Prisma migration/backfill, types/actions/cache/config-transfer updates, and seed/test updates.
3. **Settings UX:** deliver two palette editors, validation, previews, and appearance-settings alignment.
4. **Shared UI:** convert common shells, primitives, overlays, editor styles, and navigation.
5. **Route migration:** convert auth, admin, and public routes in separately reviewable batches.
6. **Hardening:** complete contrast audit, browser/mobile QA, regression fixes, documentation, and release notes.

Each checkpoint should be demoable in both modes and must pass lint, type checks, and relevant tests before proceeding. Ship the database migration before—or atomically with—the application code that expects the new fields. Keep legacy fallback reads for one release cycle, then remove them only after confirming all databases and imported configurations have migrated.

## Definition of done

- Every supported screen, component state, and overlay is readable and visually intentional in Light and Dark modes.
- A user can choose System, Light, or Dark from public and admin experiences; their preference persists and does not flash on load.
- General Settings exposes and saves light-theme color/text color and dark-theme color/text color, with previews and accessible contrast guidance/enforcement.
- Public branding, admin styling, rich text, and shared portal UI all consume the same resolved semantic tokens.
- Existing installations and configuration exports migrate without losing current palette data.
- Automated checks and the full two-mode visual/accessibility QA matrix pass.
