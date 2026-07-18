# Project Features

> Onboarding and reference documentation for the **Going Genius CMS**.
> This document describes only functionality that is actually implemented in the current codebase. Where a capability could not be found, it is marked **Not found in current codebase**.

---

# Project Overview

## Purpose

Going Genius CMS is a full-stack content management system that powers both:

1. **A public marketing website** (company site with home, services, projects/portfolio, teams, blog, contact, career, and dynamic CMS pages).
2. **A private admin dashboard** for managing customers, projects, team members, services, blogs, invoices, categories, CMS pages, and all website/site-wide configuration.

The public site is fully data-driven: navigation, header banner, footer, theme colors, SEO metadata, cookie banner, and popups are all managed from the admin panel and read live from the database.

## Tech Stack

| Layer | Technology | Version (from `package.json`) |
|-------|-----------|-------------------------------|
| Framework | Next.js (App Router) | `16.2.9` |
| UI runtime | React / React DOM | `19.2.4` |
| Language | TypeScript | `^5` |
| Database | PostgreSQL (Supabase) | — |
| ORM | Prisma (client generated to `lib/generated/prisma`) | `^6.19.3` |
| Auth | NextAuth.js (Credentials provider, JWT sessions) | `^5.0.0-beta.31` |
| Styling | Tailwind CSS | `^4` |
| Rich text | Tiptap (StarterKit + many extensions) | `^3.27.4` |
| Image upload | Uploadcare React uploader | `^1.16.0` |
| Validation | Zod | `^4.4.3` |
| Forms | React Hook Form + `@hookform/resolvers` | `^7.80.0` |
| Charts | Recharts | `^3.9.0` |
| Animation | Framer Motion | `^12.42.0` |
| Icons | lucide-react, react-icons | — |
| Password hashing | bcryptjs | `^3.0.3` |
| Supabase SDK | `@supabase/supabase-js` | `^2.108.2` |

## Architecture Overview

The app uses the Next.js App Router with **three route groups**:

| Route group | Purpose | Access |
|-------------|---------|--------|
| `app/(app)` | Admin dashboard (CMS) | Authenticated + onboarded |
| `app/(auth)` | Login and onboarding | Public / partially gated |
| `app/(user)` | Public marketing website | Public |

Key architectural patterns:

- **Server Component + Client Component split.** Each admin page has a server `page.tsx` that fetches initial data (via server actions / Prisma) and a `*Client.tsx` that manages interactivity and local state.
- **Server Actions for all mutations.** Files in `app/actions/*` are marked `"use server"`. Admin actions call `auth()` and reject unauthenticated requests; parallel `getPublic*` actions expose read-only data to public pages without auth.
- **Edge middleware for route protection.** `proxy.ts` runs the `authorized()` callback from `auth.config.ts` (Prisma-free, edge-safe) to gate routes.
- **Single Prisma client singleton** in `lib/prisma.ts`.
- **Live theming.** Site-wide colors are injected as CSS variables by `ThemeProvider`, mounted only on the public site.

```
Browser ──▶ proxy.ts (edge middleware, authConfig.authorized)
              │
              ├── (user)  → public pages ── getPublic*() actions ─┐
              ├── (auth)  → login / onboarding                    │
              └── (app)   → admin pages ── auth()-guarded actions ┼─▶ Prisma ─▶ PostgreSQL
                                                                   │
                          NextAuth (Credentials + JWT) ───────────┘
```

---

# Core Features

## Authentication

Authentication is built on **NextAuth v5** using a **Credentials provider** with **JWT session strategy** (`auth.config.ts`).

### Login

- Route: `/login` (`app/(auth)/login`), form in `LoginForm.tsx`.
- Server action `loginUser` (`app/actions/auth.ts`) validates input with `loginSchema` (Zod) and calls `signIn("credentials", { redirect: false })`.
- Credentials are validated in `lib/auth-service.ts` → `validateUserCredentials()`, which looks up the user by email and compares the password with `bcrypt.compare`.
- On success, users are routed to `/dashboard` (or `/onboarding` if not yet onboarded).

### Registration

- **Public self-registration is intentionally disabled.** The middleware `authorized()` callback returns `false` for any path starting with `/register`.
- New admin credentials are established through the **onboarding** flow, not registration.
- A migration note (`SERVER_ACTIONS.md`) references a former `registerUser` action and `/api/register` route; these are **not present** in the current codebase.

### First-time Onboarding

- Route: `/onboarding` (`app/(auth)/onboarding`).
- Server action `completeOnboarding` (`app/actions/onboarding.ts`) requires an authenticated session, validates the new email/password (`onboardingSchema`: min 8 chars, uppercase, number, special char), hashes the password with bcrypt, updates the user, and sets `isOnboarded = true`.
- Middleware forces logged-in-but-not-onboarded users to `/onboarding`, and redirects already-onboarded users away from it.

### OAuth providers

- **Not found in current codebase.** Only the Credentials provider is configured.

### Authorization

- Route gating is centralized in `auth.config.ts` → `authorized()`:
  - Public paths allowed without auth: `/`, `/home`, `/company`, `/teams`, `/career`, `/blogs`, `/contact`, `/our-services`, `/our-projects`, `/servicedetail`, `/api/auth`.
  - `/register` is blocked.
  - All other routes require a logged-in **and** onboarded user; otherwise they redirect to `/login` or `/onboarding`.
- Server actions independently re-check `auth()` before any mutation or protected read.

### Roles & Permissions

- The `User` model has a `role` field (default `"user"`) and it is propagated into the JWT and session (`token.role`, `session.user.role`, typed in `types/next-auth.d.ts`).
- **However, no role-based access control is enforced anywhere** — route protection and action guards check only that a user is authenticated/onboarded, not their role. The system effectively operates as a **single-admin** model.

## Dashboard

- Route: `/dashboard` (`app/(app)/dashboard/page.tsx`).
- Displays a `PageHeader`, a period filter control, four `StatCard` metrics (Active Projects, Total Clients, Pending Tasks, Total Revenue), a **Revenue** bar chart, and a **This Year's Growth** set of donut charts (Recharts).
- **Important:** the dashboard's stats and chart data are **hardcoded sample values** in the component, not fetched from the database.

## CMS

All CMS modules follow the same pattern (server page fetches data → client component renders list/card views, search, pagination, and modals). Mutations use server actions with Zod validation, auth checks, and optimistic UI updates.

| Module | Route | Actions file | Model |
|--------|-------|--------------|-------|
| Customers | `/customer` | `customers.ts` | `Customer` |
| Projects / Portfolio | `/projects` | `projects.ts` | `Project` |
| Team | `/team` | `team.ts` | `Team`, `Department` |
| Services | `/services` | `services.ts` | `Service` |
| Blog | `/blog` | `blogs.ts` | `Blog` |
| Invoices | `/invoices` | `invoices.ts` | `Invoice` |
| Categories | `/category` | `categories.ts` | `Category` |
| Pages | `/pages` | `pages.ts` | `Page` |
| Analytics | `/analytics` | — | `Analytics` |

### Pages

- Full CRUD via `getPages`, `createPage`, `updatePage`, `deletePage` (auth-guarded) plus `getPublicPageBySlug` (public).
- Fields: `title`, `slug` (unique), `content` (JSON, Tiptap), `thumbnail`, SEO fields (`metaTitle`, `metaDesc`, `keywords`, `metaImage`), `status` (Published/Draft).
- Published pages render on the public site through the dynamic route `app/(user)/[slug]` and `DynamicPageView` / `TiptapRenderer`.

### Categories

- CRUD via `getCategories`, `createCategory`, `updateCategory`, `deleteCategory`.
- Fields: `name`, `slug` (unique), `parent`, `order`, `banner`, `icon`, `link`, `status` (Active/Draft/Inactive). Supports ordering and a nested-parent reference.

### Blogs

- CRUD via `getBlogs`, `createBlog`, `updateBlog`, `deleteBlog`; public reads via `getPublicBlogs` and `getPublicBlogBySlug`.
- Fields: `title`, `slug` (unique), `content` (Tiptap JSON), `excerpt`, `category`, `tags[]`, `readTime`, `authorId` (FK → `Team`), `thumbnail`, `status`, `publishedAt` (auto-set when published).
- Rendered publicly at `/blogs` and `/blogs/[slug]`.

### Teams

- CRUD via `getTeamMembers`, `createTeamMember`, `updateTeamMember`, `deleteTeamMember`; public reads via `getPublicTeamMembers`.
- Fields: `fullName`, `email` (unique), `phone`, `image`, `role`, `department`, `status`, `bio`, `location`, `experience`, `skills[]`.
- **Departments** are managed inline via `getDepartments`, `createDepartment`, `deleteDepartment` (`Department` model, unique name + order).
- Team members can be authors of blogs and members of projects.

### Services

- CRUD via `getServicesPaginated`, `createService`, `updateService`, `deleteService`; lightweight `getServices` (for dropdowns) and `getPublicServices` (active only).
- Fields: `serviceName`, `description`, `category`, `basePrice`, `isActive`, `isFeatured`, `thumbnailUrl`.

### Projects

- CRUD via `getProjects`, `createProject`, `updateProject`, `deleteProject`; public reads via `getPublicProjects`.
- Rich fields: `title`, `slug`, `description`, `overview`, `category`, `liveUrl`, `status`, `budget`, `startDate`, `endDate`, `thumbnail`, `gallery[]`, `highlights[]`, `challenges[]`, `solutions[]`, `technologies[]`, `features` (JSON), `results` (JSON).
- Foreign keys: `customerId` → `Customer`, `teamId` → `Team`, `serviceId` → `Service`.

### Partners

- Managed at `/website-setup/partners` (`PartnersClient.tsx`).
- Stored as a list of logo URLs in the generic `Setting` table under key `partners-logos`. Read publicly via `getPublicPartners`.

### Technologies

- Managed at `/website-setup/technologies` (`TechnologiesClient.tsx`).
- Stored as a list of logo URLs in `Setting` under key `technologies-logos`. Read publicly via `getPublicTechnologies` (`public-settings.ts`) and `lib/get-technologies.ts`.

### Contact Settings

- Route: `/settings/contact`. Actions: `saveContactSettings` (auth) and `getPublicContactSettings`.
- Zod-validated fields: `phone1` (required), `phone2`, `email1` (required), `email2`, `address`, `contactMail` (required), `officeHours`, `googleMapEmbed`. Model `ContactSetting`.

### Email Settings

- Route: `/settings/email`. Actions: `getEmailSettings`, `saveEmailSettings`.
- Fields: `smtpHost`, `smtpPort`, `smtpUser`, `smtpPassword`, `fromName`, `fromEmail`, `encryption` (default `tls`). Model `EmailSetting`.
- **Note:** these are stored SMTP credentials only — no email-sending code was found in the codebase.

### Security Settings

- Route: `/settings/security`. Actions: `getSecuritySettings`, `saveSecuritySettings`.
- Fields: `twoFactorEnabled`, `loginAttempts`, `sessionTimeout`, `passwordMinLength`. Model `SecuritySetting`.
- **Note:** these values are persisted but **not enforced** by the authentication layer in the current code.

### Website Header

- Route: `/website-setup/header` (`WebsiteHeaderClient.tsx`). Actions: `getWebsiteHeader`, `saveWebsiteHeader`, and public `getPublicWebsiteHeader`.
- Fields: `stickyHeader`, `bannerImageUrl`, `bannerLink`, `helpNumber`, and `menuItems` (JSON — supports nested submenu items via `MenuItem { label, path, children[] }`). Model `WebsiteHeader`.
- Drives the public `LandingNavbar` and `TopBanner`.

### Website Footer

- Route: `/website-setup/footer-widgets` (`FooterWidgetsClient.tsx`). Actions: `getFooterSettings`, `saveFooterSettings`, public `getPublicFooterSettings`.
- Fields: `footerLogoUrl`, `brandText`, `aboutDesc`, `copyrightText`, `playStoreLink`, `appStoreLink`, `paymentLogoUrl`, `socials` (JSON array), `linkColumns` (JSON array of `{ title, links[] }`). Model `FooterSetting`.
- Drives the public `footer.tsx`.

### Appearance

- Route: `/settings/appearance`. Actions: `getAppearanceSettings`, `saveAppearanceSettings`, public `getPublicAppearanceSettings`.
- Fields: `hoverColor`, `hoverEnabled`, `timezone` (and `baseColor` in the model). Model `AppearanceSetting`.
- Combined with General Settings' `themeColor`/`themeTextColor`/`baseColorEnabled` to drive the live theme.

### General Settings

- Route: `/settings/general`. Actions: `getGeneralSettings`, `saveGeneralSettings`; public read via `lib/site-settings.ts` (`getSiteSettings`).
- Fields: `siteName`, `description`, `logoUrl`, `faviconUrl`, `metaKeywords`, `themeColor`, `themeTextColor`, `baseColorEnabled`. Model `GeneralSetting`.
- Feeds the root and public layouts' metadata (title, favicon, Open Graph) and the theme.

### SEO

- Route: `/settings/seo` (`SeoClient.tsx`). Actions: `getSeoSettings`, `saveSeoSettings`, public `getPublicSeoSettings`.
- Fields: `metaTitle`, `metaDescription`, `metaKeywords`, `metaImage`. Model `SeoSetting`.
- Applied in the `(user)` layout's `generateMetadata` (title template, description, keywords, Open Graph image).

### Social Links

- Route: `/settings/social`. Actions: `getSocialSettings`, `saveSocialSettings`.
- Fields: `facebook`, `twitter`, `linkedin`, `instagram`, `pinterest`, `youtube`, `whatsapp`. Model `SocialSetting`.

### Popup

- Route: `/settings/popup` (`PopupSettingsClient.tsx`). Actions: `getPopupSettings`, `savePopupSettings`, public `getPublicPopupSettings`.
- Fields: `showPopup`, `content`. Model `PopupSetting`. Rendered on the public site via `SitePopup`.

### Cookies

- Route: `/settings/cookies` (`CookiesSettingsClient.tsx`). Actions: `getCookieSettings`, `saveCookieSettings`, public `getPublicCookieSettings`.
- Fields: `cookiesAgreement`, `showCookiesAgreement`, `cookiesAgreementText`. Model `CookieSetting`. Rendered via `CookieBanner`.

### Rich Text Editor

- `components/TiptapEditor.tsx` (with `EditorToolbar.tsx`) provides a Tiptap-based WYSIWYG editor. Configured extensions (from `package.json`) include StarterKit, Link, Image, Underline, Highlight, Color, TextStyle, TextAlign, Placeholder, CharacterCount, Table (+ row/cell/header), TaskList/TaskItem, and CodeBlockLowlight (syntax highlighting via `lowlight`).
- Content is stored as JSON in `Blog.content` and `Page.content`, and rendered on the public site with `TiptapRenderer.tsx`.

### Media Uploads

- `components/ImageUploader.tsx` wraps Uploadcare's `FileUploaderRegular` (image-only, 5 MB max). Uploaded files return a CDN URL (`file.cdnUrl`) that is stored directly in the database. Uses `NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY`.

## Website Features

The public site is composed in `app/(user)/layout.tsx`, which fetches all site config in parallel and wraps pages with the themed navbar, optional top banner, footer, cookie banner, and popup.

| Route | Description |
|-------|-------------|
| `/home` | Landing page (`HomeClient.tsx`, `PartnersSection.tsx`) |
| `/about-us` | About page |
| `/company` | Company page |
| `/teams` | Public team listing (`getPublicTeamMembers`) |
| `/career`, `/career/apply` | Careers listing and application page |
| `/blogs`, `/blogs/[slug]`, `/blogs/article` | Blog index and article pages |
| `/contact` | Contact page + form (`ContactClient.tsx`, uses contact settings) |
| `/our-services` | Services section (`ServicesSection.tsx`) |
| `/our-projects`, `/our-projects/[id]` | Projects grid + detail (`ProjectsGrid.tsx`) |
| `/portfolio`, `/portfolio/[slug]` | Portfolio index + detail |
| `/servicedetail` | Service detail page |
| `/projects` | Public projects route |
| `/[slug]` | Dynamic CMS page renderer for published `Page` records |

Supporting public/landing components: `LandingNavbar`, `LandingServicesSection`, `LandingFeaturedProjects`, `LandingTeamSection`, `LandingPartnersSection`, `LandingTechSection`, `Navbar`, `TopBanner`, `footer`, `CookieBanner`, `SitePopup`, `DynamicPageView`, `TiptapRenderer`.

Site-wide behaviors:
- Live theme colors injected via `ThemeProvider` (indigo/purple utility classes remapped to the configured theme color; hover color configurable).
- SEO metadata, favicon, and Open Graph tags generated from General + SEO settings.
- Optional sticky header + promotional top banner.
- Cookie consent banner and marketing popup, both toggleable from settings.

## Admin Features

Admins can, from the `(app)` dashboard:

- Manage the full lifecycle (create/edit/delete, list/card views, search, pagination) of Customers, Projects, Team members, Services, Blogs, Invoices, Categories, and CMS Pages.
- Manage Departments (inline add/delete).
- Upload images (Uploadcare) for customers, team, services, projects, blogs, pages, and banners.
- Author rich content with the Tiptap editor for blogs and pages.
- Configure the public website: header/navigation + banner, footer widgets/links/socials, partners logos, technologies logos, and add new pages.
- Configure site-wide settings: General, Appearance (theme/hover/timezone), SEO, Social links, Contact, Email/SMTP, Security, Popup, and Cookies.
- View the dashboard overview (currently with sample chart data).

Admin shell (`app/(app)/layout.tsx`): fixed `Sidebar` with mobile drawer, independent scroll container, `MobileHeader`, `Topbar`, `SettingsNav` for settings sub-navigation, and `UserProfile` with logout.

## AI Features

**Not found in current codebase.** No AI/LLM SDKs, API integrations, or AI-driven functionality (e.g., OpenAI, Anthropic, Gemini, `@ai-sdk`) were found.

## Database

**Provider:** PostgreSQL (Supabase), via Prisma. Client is generated to `lib/generated/prisma`. Connection uses `DATABASE_URL` (pooled) and `DIRECT_URL` (direct).

### Core domain models

| Model (table) | Key fields | Relationships |
|---------------|-----------|---------------|
| `User` (`users`) | `email` (unique), `password`, `role`, `isOnboarded` | — (auth only) |
| `Customer` (`customers`) | `fullName`, `email` (unique), `status`, `image` | `service` (FK, optional), `projects[]`, `invoices[]` |
| `Team` (`teams`) | `fullName`, `email` (unique), `role`, `department`, `skills[]`, `bio` | `blogs[]`, `projects[]` |
| `Service` (`services`) | `serviceName`, `basePrice`, `isActive`, `isFeatured` | `customers[]`, `projects[]` |
| `Project` (`projects`) | `title`, `slug` (unique), `status`, JSON `features`/`results`, arrays | `customer`, `team`, `service` (FKs), `invoices[]`, `analytics[]` |
| `Blog` (`blogs`) | `title`, `slug` (unique), `content` (JSON), `status`, `publishedAt` | `author` (FK → `Team`) |
| `Invoice` (`invoices`) | `invoiceNumber` (unique), `amount`, `tax`, `total`, `status` | `customer`, `project` (FKs) |
| `Analytics` (`analytics`) | `metricName`, `metricValue`, `dimension`, `recordedDate` | `project` (FK) |
| `Page` (`pages`) | `title`, `slug` (unique), `content` (JSON), meta fields, `status` | — |
| `Category` (`categories`) | `name`, `slug` (unique), `parent`, `order`, `status` | self-referencing by `parent` string |
| `Department` (`departments`) | `name` (unique), `order` | — (referenced by `Team.department` string) |

### Settings models (singleton rows)

`GeneralSetting`, `SeoSetting`, `AppearanceSetting`, `ContactSetting`, `SocialSetting`, `EmailSetting`, `SecuritySetting`, `CookieSetting`, `PopupSetting`, `WebsiteHeader`, `FooterSetting` — each read/written as "find first, then update or create." Plus a generic key/value store:

| Model | Purpose |
|-------|---------|
| `Setting` (`settings`) | Generic `key` → `value` (JSON). Used for `technologies-logos`, `partners-logos`, and `website-header`. |

### Relationship summary

```
Customer 1───* Project *───1 Team
   │              │
   │*             │*
   ▼              ▼
Invoice        Analytics
Service 1───* Project,  Service 1───* Customer
Team    1───* Blog (author)
Customer 1───* Invoice ; Project 1───* Invoice
```

## API Endpoints

This project favors **Server Actions over REST endpoints**. The only implemented HTTP route is NextAuth:

| Method | Path | Purpose |
|--------|------|---------|
| `GET`/`POST` | `/api/auth/[...nextauth]` | NextAuth handlers (sign-in, session, callbacks) |

- `app/api/projects` and `app/api/team` directories exist but contain **no route files** (empty).

### Server Actions (grouped by module)

| Module | File | Functions |
|--------|------|-----------|
| Auth | `auth.ts` | `loginUser`, `getCurrentUser` |
| Onboarding | `onboarding.ts` | `completeOnboarding` |
| Customers | `customers.ts` | `getCustomers`, `getCustomerStats`, `getCustomerById`, `createCustomer`, `updateCustomer`, `deleteCustomer` |
| Projects | `projects.ts` | `getProjects`, `getPublicProjects`, `createProject`, `updateProject`, `deleteProject` |
| Team | `team.ts` | `getTeamMembers`, `getPublicTeamMembers`, `createTeamMember`, `updateTeamMember`, `deleteTeamMember`, `getDepartments`, `createDepartment`, `deleteDepartment` |
| Services | `services.ts` | `getServices`, `getPublicServices`, `getServicesPaginated`, `createService`, `updateService`, `deleteService` |
| Blogs | `blogs.ts` | `getBlogs`, `createBlog`, `updateBlog`, `deleteBlog`, `getPublicBlogs`, `getPublicBlogBySlug` |
| Invoices | `invoices.ts` | `getInvoices`, `createInvoice`, `updateInvoice`, `deleteInvoice` |
| Categories | `categories.ts` | `getCategories`, `createCategory`, `updateCategory`, `deleteCategory` |
| Pages | `pages.ts` | `getPages`, `getPublicPageBySlug`, `createPage`, `updatePage`, `deletePage` |
| Settings (generic) | `settings.ts` | `getSetting`, `saveSetting`, `getPublicHeaderSettings`, `getPublicPartners` |
| Public settings | `public-settings.ts` | `getPublicTechnologies` |
| General | `general-settings.ts` | `getGeneralSettings`, `saveGeneralSettings` |
| Appearance | `appearance.ts` | `getAppearanceSettings`, `saveAppearanceSettings`, `getPublicAppearanceSettings` |
| SEO | `seo.ts` | `getSeoSettings`, `saveSeoSettings`, `getPublicSeoSettings` |
| Contact | `contact-settings.ts` | `saveContactSettings`, `getPublicContactSettings` |
| Email | `email-settings.ts` | `getEmailSettings`, `saveEmailSettings` |
| Security | `security-settings.ts` | `getSecuritySettings`, `saveSecuritySettings` |
| Social | `social.ts` | `getSocialSettings`, `saveSocialSettings` |
| Cookies | `cookie-settings.ts` | `getCookieSettings`, `saveCookieSettings`, `getPublicCookieSettings` |
| Popup | `popup.ts` | `getPopupSettings`, `savePopupSettings`, `getPublicPopupSettings` |
| Website header | `website-header.ts` | `getWebsiteHeader`, `saveWebsiteHeader`, `getPublicWebsiteHeader` |
| Footer | `footer-settings.ts` | `getFooterSettings`, `saveFooterSettings`, `getPublicFooterSettings` |

## Components

Located in `components/`. Major reusable components:

**Layout / navigation:** `Sidebar` (+ `MobileHeader`), `Topbar`, `TopbarActions`, `PageHeader`, `SettingsNav`, `Navbar`, `LandingNavbar`, `TopBanner`, `footer`.

**Data display:** `Card`, `StatCard`, `Pagination`, `RowActions`, `SearchBar`.

**Forms / modals:** `Button`, `ImageUploader`, `ProjectModal`, `BlogModal`, `InvoiceModal`, `AddServiceModal`, `EditServiceModal`, `AddMemberModal`, `TeamMemberModal`, `AddcostumerModal`, `EditCustomerModal`, `AddCategoryModal`, `AddDepartmentModal`, `AddDesignationModal`, `AddPageModal`, `PageEditModal`, `DeleteConfirmModal`, `ViewDetailModal`, `ServiceDetailModal`.

**Editor:** `TiptapEditor`, `EditorToolbar`, `TiptapRenderer`.

**Public/landing:** `LandingServicesSection`, `LandingFeaturedProjects`, `LandingTeamSection`, `LandingPartnersSection`, `LandingTechSection`, `DynamicPageView`, `CookieBanner`, `SitePopup`.

**Providers/auth:** `AuthProvider` (NextAuth `SessionProvider`), `ThemeProvider`, `UserProfile`.

## State Management

- **No global state library** (no Redux/Zustand/Jotai). State is local React state.
- Server components fetch initial data and pass it as props (`initialData`) to client components.
- Client components use `useState` for lists/filters and `useTransition` for background refreshes after mutations.
- **Optimistic updates:** delete operations remove the item from local state immediately; the server action runs in the background. Some actions (e.g., customers) also call `revalidatePath`, while most rely on client-managed refresh.
- Auth/session state comes from NextAuth's `SessionProvider` (`AuthProvider`).

## File Storage

- **Uploadcare** is the sole file-storage mechanism. Images are uploaded client-side through `ImageUploader`, and the returned **CDN URL** is stored as a plain string in the database. No local disk or S3/Supabase Storage upload code was found.
- `next.config.ts` allows remote images from `api.dicebear.com` (avatars) and `*.ucarecdn.net` / `*.ucarecd.net` (Uploadcare CDN), with SVG allowed.
- `lib/images.ts` is a static registry of bundled `public/` assets used by landing pages.

## Validation

- **Zod** is used throughout for server-side validation in server actions (e.g., `projectSchema`, `customerSchema`, `blogSchema`, `serviceSchema`, `teamMemberSchema`, `invoiceSchema`, `categorySchema`, `pageSchema`, `contactSettingsSchema`, `loginSchema`, `onboardingSchema`).
- **React Hook Form** with `@hookform/resolvers` handles client-side form state.
- Common patterns: `.safeParse()` returning the first issue message, unique-constraint handling (Prisma error code `P2002`), FK-constraint handling (`P2003`), and field-level error maps (contact settings).
- Notable rules: onboarding password (min 8, uppercase, number, special char); customer phone (exactly 10 digits); contact phone character allow-list.

## Security

| Concern | Implementation |
|---------|----------------|
| Authentication | NextAuth v5 Credentials provider, JWT session strategy (`auth.config.ts`) |
| Password storage | `bcryptjs` hashing (10 rounds) in onboarding; `bcrypt.compare` at login |
| Route protection | Edge middleware `proxy.ts` running `authorized()`; matcher excludes static assets and images |
| Action-level auth | Every mutating/protected server action calls `auth()` and rejects when no session |
| CSRF | Provided by NextAuth for auth flows and by Next.js Server Actions' built-in protections |
| Public vs private data | Dedicated `getPublic*` actions expose only safe, read-only fields to the public site |
| Secret handling | Secrets read from env only (`AUTH_SECRET`, DB URLs, Uploadcare public key); `.env` is git-ignored; `serverExternalPackages: ["bcryptjs"]` keeps bcrypt server-side |
| Registration | Disabled at the middleware level |

Gaps observed (see Known Limitations):
- **No role-based authorization** despite a `role` field.
- **Security settings** (`loginAttempts`, `sessionTimeout`, `twoFactorEnabled`, `passwordMinLength`) are stored but **not enforced**.
- **No rate limiting** code was found.

## Third-party Integrations

| Service / Library | Usage |
|-------------------|-------|
| Supabase (PostgreSQL) | Primary database (via Prisma). `@supabase/supabase-js` is installed as a dependency. |
| Uploadcare | Image uploads + CDN hosting (`@uploadcare/react-uploader`). |
| NextAuth.js v5 | Authentication and session management. |
| Prisma | ORM / query layer. |
| Tiptap | Rich text editing (many extensions) + `lowlight` for code highlighting. |
| Recharts | Dashboard charts. |
| Framer Motion | Animations. |
| DiceBear | Default avatar images (allowed remote host, used as customer image default). |
| Vercel | Intended deployment target (`AUTH_URL` auto-detection notes, `postinstall` runs `prisma generate`). |

## Folder Structure

```
cms/
├── app/
│   ├── (app)/            # Admin dashboard (auth-gated)
│   │   ├── dashboard/ customer/ projects/ team/ services/ blog/
│   │   ├── invoices/ category/ pages/ analytics/
│   │   ├── settings/     # general, contact, email, social, security,
│   │   │                 # appearance, seo, popup, cookies
│   │   ├── website-setup/ # header, footer-widgets, partners,
│   │   │                 # technologies, add-newpage
│   │   └── layout.tsx    # admin shell (sidebar + scroll container)
│   ├── (auth)/           # login, onboarding
│   ├── (user)/           # public marketing site + dynamic [slug] pages
│   ├── actions/          # all server actions ("use server")
│   ├── api/auth/[...nextauth]/route.ts
│   ├── layout.tsx        # root layout (metadata, AuthProvider)
│   ├── globals.css
│   └── page.tsx
├── components/           # reusable UI, modals, editor, landing sections
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   ├── auth-service.ts   # credential validation
│   ├── site-settings.ts  # public general settings
│   ├── get-technologies.ts, images.ts, color-contrast.ts, utils.ts
│   ├── validations/auth.ts
│   └── generated/prisma  # generated Prisma client
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed-*.ts         # seed scripts (team, blogs, projects, header, etc.)
├── scripts/seed-admin.ts # seeds the initial admin user
├── types/next-auth.d.ts  # session/JWT type augmentation
├── auth.ts, auth.config.ts, proxy.ts  # NextAuth + edge middleware
├── next.config.ts, prisma.config.ts, postcss.config.mjs, eslint.config.mjs
└── public/               # static images/logos
```

## Current Capabilities

**Public visitors can:**
- Browse the home, about, company, services, projects/portfolio, teams, blog, and contact pages.
- View individual published blog posts (`/blogs/[slug]`) and dynamic CMS pages (`/[slug]`).
- View project and service details.
- See a themed site whose colors, header/banner, navigation, footer, partners, and technologies are admin-controlled.
- See/dismiss the cookie consent banner and marketing popup (when enabled).
- Use the contact page (form present; see limitations regarding delivery).

**Authenticated admins can:**
- Log in and complete first-time onboarding (set their own email/password).
- Create, edit, delete, search, and paginate: Customers, Projects, Team members, Services, Blogs, Invoices, Categories, and CMS Pages.
- Manage Departments.
- Upload images via Uploadcare and author rich content with Tiptap.
- Configure the public website header (nav + banner), footer widgets, partners logos, and technologies logos; create new pages.
- Manage all settings: General, Appearance, SEO, Social, Contact, Email/SMTP, Security, Popup, Cookies.
- View a dashboard overview (with sample metric/chart data).

## Known Limitations

- **Dashboard metrics and charts are hardcoded** sample data, not real database aggregates.
- **No role-based authorization** — the `role` field is stored/propagated but never checked; the app is effectively single-admin.
- **Security settings are not enforced** — 2FA, login attempt limits, session timeout, and password min length are persisted but have no runtime effect.
- **Email is not sent** — SMTP settings are stored, but no mailer/sending logic exists (contact form delivery, invoice email, etc. not implemented).
- **No rate limiting** on authentication or actions.
- **No automated tests** were found in the codebase.
- **No public self-registration** (by design; blocked in middleware).
- `app/api/projects` and `app/api/team` are **empty** directories.
- The `Analytics` model has no admin CRUD actions; the `/analytics` route exists but analytics data is not written by any implemented flow.
- `SERVER_ACTIONS.md` documents a `registerUser` action / `/api/register` route that no longer exist in the code.

## Future Expansion Points

These are extension points that already exist in the architecture (no new features implied):

- **Roles & permissions:** the `User.role` field and session propagation are in place; RBAC checks could be added to `authorized()` and server actions.
- **Security enforcement:** `SecuritySetting` values are persisted and ready to be wired into the auth flow (attempt limiting, session timeout, 2FA, password policy).
- **Email delivery:** `EmailSetting` (SMTP config) is stored and ready for a mailer implementation (e.g., contact form, invoice notifications).
- **Analytics:** the `Analytics` model and `Project` relation exist; a data pipeline + dashboard queries could replace the current sample data.
- **Generic settings store:** the key/value `Setting` model makes adding new admin-managed config (like the existing `partners-logos` / `technologies-logos`) low-friction.
- **REST API surface:** the empty `app/api/projects` and `app/api/team` folders indicate intended HTTP endpoints that could reuse existing server-action logic.
- **Additional OAuth providers:** NextAuth is configured such that providers can be added in `auth.ts`.

---

*Generated from static analysis of the repository. Section content reflects the implementation present at the time of writing.*
