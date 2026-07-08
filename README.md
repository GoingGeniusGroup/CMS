# Going Genius CMS

A comprehensive Content Management System designed for organizations to manage clients, projects, team members, services, blogs, invoices, analytics, and website configuration — all from a unified admin dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma v6 |
| Authentication | NextAuth.js v5 (Credentials + JWT) |
| Styling | Tailwind CSS v4 |
| Image Upload | Uploadcare |
| Validation | Zod |
| Deployment | Vercel |

---

## Route Map

### Public Routes (No Auth Required)

| Route | Description |
|-------|-------------|
| `/` | Root — redirects to `/home` |
| `/home` | Public landing page (company website) |
| `/login` | Admin login page |
| `/onboarding` | First-time user setup |

### Admin Routes (Auth Required)

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Dashboard | Overview metrics and quick access |
| `/customer` | Customers | Manage client records |
| `/projects` | Projects / Portfolio | Manage projects with FK relations |
| `/team` | Team | Manage team members |
| `/services` | Services | Manage offered services |
| `/blog` | Blog | Manage blog posts |
| `/invoices` | Invoices | Manage billing and invoices |
| `/analytics` | Analytics | View project analytics |
| `/pages` | Pages | Manage CMS pages |

### Settings Sub-Routes (`/settings/*`)

| Route | Page | Description |
|-------|------|-------------|
| `/settings` | Settings Index | Redirects to General |
| `/settings/general` | General | Site-wide configuration |
| `/settings/contact` | Contact | Contact information |
| `/settings/email` | Email | Email/SMTP settings |
| `/settings/social` | Social | Social media links |
| `/settings/security` | Security | Security settings |
| `/settings/appearance` | Appearance | Theme and display |
| `/settings/seo` | SEO | Meta tags, sitemap config |
| `/settings/popup` | Popup | Popup/banner configuration |
| `/settings/cookies` | Cookies | Cookie consent settings |

### Website Setup Sub-Routes (`/website-setup/*`)

| Route | Page | Description |
|-------|------|-------------|
| `/website-setup/header` | Website Header | Header/navigation config |
| `/website-setup/footer-widgets` | Footer Widgets | Footer section management |
| `/website-setup/add-newpage` | Add New Page | Create new website pages |

---

## Pages — Detailed Feature Breakdown

### `/home` — Public Landing Page

The organization's public-facing website rendered within the CMS.

- Hero section with stats (350+ Clients, 75+ Projects, 12+ Years, 98% Satisfaction)
- Services grid (Web Development, Mobile Apps, UI/UX Design, Digital Marketing, SEO, IT Consulting)
- Stats banner
- "Why Us" section with trust indicators
- Client testimonials
- Contact form
- Footer with admin portal link
- Fully responsive, dark theme
- "Admin Login" button in navbar navigates to `/login`

---

### `/login` — Authentication

- Email + password credential login
- Form validation
- Error display
- Redirect to `/dashboard` on success (or `/onboarding` if not onboarded)
- JWT-based sessions

---

### `/onboarding` — First-Time Setup

- Runs once after first login
- Sets `isOnboarded = true`
- Redirects to dashboard on completion

---

### `/dashboard` — Admin Dashboard

- Overview page
- Quick access to all modules
- Protected by auth middleware

---

### `/customer` — Customer Management

**Layout**: Matches Projects page exactly

- **Header**: Page title + "Add Customer" button (top right)
- **Stats Cards**: Total Customers / Active / Inactive (3-column grid)
- **Toolbar**: List/Card view toggle + Search bar
- **List View**: Table with columns — #, Customer (avatar + name + company), Email, Phone, Service, Status badge, Actions
- **Card View**: Responsive grid (1/2/3 cols) with avatar, name, company, status, email, phone, service, action buttons
- **Search**: Filters by name, email, company, service (client-side)
- **Pagination**: Server-side paginated
- **CRUD**: Create via modal (with Uploadcare photo upload), Delete with confirmation modal
- **Optimistic Updates**: Item removed from UI instantly on delete

---

### `/projects` — Projects / Portfolio

**Layout**: Reference template for all other pages

- **Header**: "Projects / Portfolio" title + "Add Project" button
- **Stats Cards**: Total Projects / Published / Drafts
- **Toolbar**: List/Card view toggle + Search bar
- **List View**: Table — #, Title, Customer, Service, Status, Actions
- **Card View**: Grid with thumbnail (Uploadcare or gradient placeholder), title, status badge, description, client, service, budget, action buttons
- **Search**: Filters by title, customer name, service name
- **Pagination**: Server-side
- **CRUD**: Full Create/Edit/Delete via ProjectModal
- **Fields**: Title, Description, Customer (FK dropdown), Team (FK dropdown), Service (FK dropdown), Start Date, End Date, Budget, Thumbnail (Uploadcare), Status
- **Optimistic Deletes** with DeleteConfirmModal

---

### `/team` — Team Management

- **Header**: "Team" title + Filter + "Add Member" button
- **Stats Cards**: Total Members / Active / On Leave / Departments (4-column)
- **Search**: Filters by name, email, role, department
- **Desktop Table**: Image, Name, Role, Department, Phone, Email, Status, Actions
- **Mobile Cards**: Avatar, name, role, department, status, phone, email, action buttons
- **CRUD**: Add/Edit via AddMemberModal (Uploadcare photo upload), Delete with confirmation
- **Fields**: Full Name, Email, Phone, Image (Uploadcare), Role/Designation, Department, Status
- **Server Actions**: `getTeamMembers`, `createTeamMember`, `updateTeamMember`, `deleteTeamMember`
- **Optimistic Deletes**

---

### `/services` — Service Management

**Layout**: Matches Projects page exactly

- **Header**: "Services" title + "Add Service" button
- **Stats Cards**: Total Services / Active / Inactive
- **Toolbar**: List/Card view toggle + Search bar
- **List View**: Table — #, Thumbnail, Service Name, Description, Status, Actions
- **Card View**: Grid with thumbnail, title + status, description, category, base price, action buttons
- **Search**: Filters by name, description, category
- **CRUD**: Add via AddServiceModal (Uploadcare thumbnail), Edit via EditServiceModal, Delete with confirmation
- **Fields**: Service Name, Short Details, Description, Thumbnail (Uploadcare), Category, Base Price, Active/Inactive
- **Optimistic Deletes**

---

### `/blog` — Blog Management

**Layout**: Matches Projects page exactly

- **Header**: "Blog" title + Filter + "Add Blog" button
- **Stats Cards**: Total Blogs / Published / Drafts
- **Toolbar**: List/Card view toggle + Search bar
- **List View**: Table — #, Title, Slug, Category, Author, Status, Actions
- **Card View**: Grid with title + status badge, slug, category, author, action buttons
- **Search**: Filters by title, slug, category
- **CRUD**: Full Create/Edit via BlogModal, Delete with confirmation
- **Fields**: Title, Slug (auto-generated from title), Content, Category, Author (FK dropdown → Team), Thumbnail (Uploadcare), Status (Published/Draft)
- **Auto-publish date** tracking
- **Optimistic Deletes**

---

### `/invoices` — Invoice Management

- **Header**: "Invoices" title + Filter + "Add Invoice" button
- **Stats Cards**: Total / Paid / Pending / Overdue (4-column)
- **Search**: Filters by invoice number, customer, project, status
- **Desktop Table**: Invoice #, Customer, Project, Amount, Issued Date, Due Date, Status badge, Actions
- **Mobile Cards**: Invoice #, customer, status badge, amount, due date, action buttons
- **CRUD**: Full Create/Edit via InvoiceModal, Delete with confirmation
- **Fields**: Invoice Number (unique), Customer (FK dropdown), Project (FK dropdown), Amount, Tax, Total (auto-calculated), Status (Paid/Pending/Overdue), Issued Date, Due Date
- **Status Badges**: Color-coded (green=Paid, yellow=Pending, red=Overdue)
- **Optimistic Deletes**

---

### `/analytics` — Analytics

- Project-level analytics tracking
- Metrics: name, value, dimension, recorded date

---

### `/settings` — Settings

Shared layout with a sub-navigation sidebar (horizontal on mobile, vertical on desktop).

#### `/settings/general`
- Site-wide configuration options

#### `/settings/contact`
- Organization contact details (phone, email, address)

#### `/settings/email`
- Email/SMTP configuration

#### `/settings/social`
- Social media profile links

#### `/settings/security`
- Security-related settings

#### `/settings/appearance`
- Theme, colors, display preferences

#### `/settings/seo`
- Meta titles, descriptions, sitemap settings

#### `/settings/popup`
- Popup/banner configuration and management

#### `/settings/cookies`
- Cookie agreement toggle
- Cookie agreement text editor
- Show/hide cookie consent banner toggle

---

### Website Setup

#### `/website-setup/header`
- Website header/navigation configuration

#### `/website-setup/footer-widgets`
- Footer widget management

#### `/website-setup/add-newpage`
- Create new website pages

---

## Components Library

### Layout Components
| Component | Description |
|-----------|-------------|
| `Sidebar` | Dark sidebar with nav, user profile, logout (collapsible mobile drawer) |
| `Topbar` | Top bar with optional search |
| `PageHeader` | Consistent page title + description |
| `SettingsNav` | Settings sub-navigation (9 items) |

### Data Display
| Component | Description |
|-----------|-------------|
| `Card` | Container card with optional `noPadding` |
| `StatCard` | Stat metric card (icon + label + value) |
| `Pagination` | Page navigation with range label |
| `RowActions` | View/Edit/Delete actions (icons or buttons variant) |

### Forms & Modals
| Component | Description |
|-----------|-------------|
| `Button` | Primary/secondary button |
| `ImageUploader` | Uploadcare-powered image upload with preview |
| `ProjectModal` | Create/Edit project form |
| `BlogModal` | Create/Edit blog form |
| `InvoiceModal` | Create/Edit invoice form |
| `AddServiceModal` | Create service form |
| `EditServiceModal` | Edit service form |
| `AddMemberModal` | Create/Edit team member form |
| `AddCustomerModal` | Create customer form |
| `EditCustomerModal` | Edit customer form |
| `DeleteConfirmModal` | Reusable delete confirmation (icon + loading state) |
| `AddDesignationModal` | Add new designation inline |
| `AddPageModal` | Create new website page |

### Auth
| Component | Description |
|-----------|-------------|
| `AuthProvider` | NextAuth SessionProvider wrapper |
| `UserProfile` | User avatar/name/role display (sidebar) |
| `LoginForm` | Email/password login form |

---

## Server Actions

All mutations use server actions with Zod validation and auth checks.

| File | Functions |
|------|-----------|
| `actions/auth.ts` | Authentication utilities |
| `actions/onboarding.ts` | Onboarding completion |
| `actions/customers.ts` | `getCustomers`, `getCustomerStats`, `getCustomerById`, `createCustomer`, `updateCustomer`, `deleteCustomer` |
| `actions/projects.ts` | `getProjects`, `createProject`, `updateProject`, `deleteProject` |
| `actions/team.ts` | `getTeamMembers`, `createTeamMember`, `updateTeamMember`, `deleteTeamMember` |
| `actions/services.ts` | `getServices`, `getServicesPaginated`, `createService`, `updateService`, `deleteService` |
| `actions/blogs.ts` | `getBlogs`, `createBlog`, `updateBlog`, `deleteBlog` |
| `actions/invoices.ts` | `getInvoices`, `createInvoice`, `updateInvoice`, `deleteInvoice` |

---

## Database Schema

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Customers  │     │   Projects  │     │    Team     │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)     │◄────│ customerId  │     │ id (PK)     │
│ fullName    │     │ teamId      │────►│ fullName    │
│ email       │     │ serviceId   │     │ email       │
│ phoneNumber │     │ title       │     │ phone       │
│ companyName │     │ description │     │ image       │
│ address     │     │ status      │     │ role        │
│ image       │     │ thumbnail   │     │ department  │
│ status      │     │ startDate   │     │ status      │
│ serviceId   │     │ endDate     │     │ joinedAt    │
│ createdAt   │     │ budget      │     └─────────────┘
└─────────────┘     │ createdAt   │            │
       │            └─────────────┘            │
       │                   │                   ▼
       │                   │            ┌─────────────┐
       │                   │            │    Blog     │
       ▼                   ▼            ├─────────────┤
┌─────────────┐     ┌─────────────┐    │ id (PK)     │
│  Invoices   │     │  Analytics  │    │ authorId    │
├─────────────┤     ├─────────────┤    │ title       │
│ id (PK)     │     │ id (PK)     │    │ slug        │
│ customerId  │     │ projectId   │    │ content     │
│ projectId   │     │ metricName  │    │ category    │
│ invoiceNo   │     │ metricValue │    │ thumbnail   │
│ amount      │     │ dimension   │    │ status      │
│ tax         │     │ recordDate  │    │ publishedAt │
│ total       │     │ createdAt   │    │ createdAt   │
│ status      │     └─────────────┘    └─────────────┘
│ issuedDate  │
│ dueDate     │     ┌─────────────┐
│ createdAt   │     │  Services   │
└─────────────┘     ├─────────────┤
                    │ id (PK)     │
                    │ serviceName │
                    │ description │
                    │ basePrice   │
                    │ category    │
                    │ isActive    │
                    │ thumbnailUrl│
                    │ createdAt   │
                    └─────────────┘
```

**Relationships:**
- Project → Customer (FK), Team (FK), Service (FK)
- Blog → Team/Author (FK)
- Invoice → Customer (FK), Project (FK)
- Analytics → Project (FK)
- Customer → Service (FK)

---

## Architecture Patterns

### Server Component + Client Component Pattern
Every data page follows the same architecture:
1. **Server Component** (`page.tsx`) — Fetches initial data via Prisma directly (single `auth()` call, all queries in `Promise.all`)
2. **Client Component** (`*Client.tsx`) — Receives `initialData` prop, manages local state, uses `useTransition` for background refresh

### Optimistic Updates
- Delete operations remove the item from local state immediately
- Server action runs in the background
- On failure, data is re-fetched to revert

### No `revalidatePath`
Mutation actions do not call `revalidatePath` — the client manages its own state refresh via `useTransition`, preventing the Next.js RSC re-render cycle that causes the "Rendering..." indicator.

### Image Upload
All image uploads use the reusable `ImageUploader` component powered by Uploadcare. Uploaded images are stored as CDN URLs in the database.

---

## Environment Variables

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
AUTH_SECRET="your-secret-min-32-characters"
AUTH_URL="http://localhost:3000"

# Uploadcare
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY="your-public-key"
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — lands on the public homepage.
Click "Admin Login" to access the CMS dashboard.

### Production Build

```bash
npm run build
npm start
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy — `prisma generate` runs automatically via `postinstall`

---

## License

Private — Going Genius Group of Companies
