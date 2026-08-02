# Admin Panel — Organization-Agnostic Redesign

**Purpose of this document**: Analyze the existing admin panel (currently modeled around an IT/software agency: "Projects/Portfolio," "Technologies," client-based invoicing) and specify the field-level, terminology, and configuration changes needed so the same platform can serve **any organization type** — cafés, restaurants, construction firms, hospitals, schools, retail stores, NGOs, manufacturers, logistics companies, professional services, and more — without a code fork per industry.

No code is included below. Every recommendation is a spec: what to add, remove, rename, or make configurable, and why.

---

## 1. Core Design Philosophy

The current schema hardcodes an agency's mental model into field names, dropdown options, and page copy (e.g., "Web & Software" growth ring, "Technologies" logos, project "Live URL" and "Gallery"). To generalize this without rebuilding per client, four cross-cutting mechanisms should be introduced. Every per-module recommendation below assumes these exist.

### 1.1 Business Type / Industry Profile
A new setting (in **Settings > General**) lets the admin pick an **Industry Profile** at setup:
`Generic / IT & Software / Café & Restaurant / Retail / Construction / Healthcare / Education / NGO & Nonprofit / Manufacturing / Logistics & Transport / Professional Services / Hospitality / Custom`

Selecting a profile does two things:
- **Applies a terminology preset** (module names, field labels, status options) from a lookup table — nothing is hardcoded in the UI layer.
- **Toggles module/field visibility** — fields irrelevant to that industry (e.g., "Live URL" for a hospital) are hidden, not deleted, so switching profiles later doesn't lose data.

"Custom" lets the admin override any label individually without picking a preset.

### 1.2 Configurable Entity Labels
Every core entity (Customer, Project, Service, Team, Invoice) gets an editable **display label** (singular/plural) stored centrally and referenced everywhere — sidebar, page titles, buttons, column headers, search placeholders. Example: the "Customer" entity can be relabeled "Patient," "Guest," "Member," "Student," "Donor," or "Client" without touching the underlying table.

### 1.3 Custom Fields Engine
Rather than growing every table with industry-specific columns forever, add a generic **custom fields** mechanism per module (key, label, type [text/number/date/dropdown/toggle], required flag, display order). This lets an admin add "Allergens" for a restaurant menu item or "License Plate" for a logistics shipment without a schema migration for every industry.

### 1.4 Configurable Status Workflows
Hardcoded status enums (`Published/Draft`, `Active/Inactive`, `Paid/Pending/Overdue`) should become **admin-editable status lists per module**, with color and default preserved, so a hospital can use `Admitted / Discharged / Referred` on the same underlying "status" field a café uses for `Open / Closed / Reserved`.

---

## 2. Terminology Mapping (Illustrative)

| Generic Concept | IT/Agency (current) | Café/Restaurant | Retail | Construction | Healthcare | Education | NGO |
|---|---|---|---|---|---|---|---|
| Customer entity | Customer | Guest | Customer | Client | Patient | Student | Beneficiary/Donor |
| Project entity | Project/Portfolio | Reservation/Order | Order | Project/Site | Case/Visit | Course/Enrollment | Program/Case |
| Service entity | Service | Menu Item | Product | Service/Trade | Treatment | Course | Program |
| Team entity | Team | Staff | Staff | Crew | Staff/Provider | Faculty | Volunteer/Staff |
| Invoice entity | Invoice | Bill/Receipt | Receipt/Invoice | Invoice/Bill | Bill | Tuition Invoice | Receipt/Donation Record |

This table is not exhaustive — it exists to prove that the same 5 entities and the same underlying fields (name, status, date, amount, assigned staff) cover every vertical once labels are configurable.

---

## 3. Module-by-Module Analysis

### 3.1 Dashboard

**Current fields**: Active Projects, Total Clients, Pending Tasks, Total Revenue, Revenue chart (Received/Pending/Overdue bars), "This Year's Growth" rings (Web & Software / Customer Growth / On-time Projects).

**Issues**: "Active Projects" and "Web & Software" are hard IT framing. A café or hospital has no concept of "software delivered on time."

**Recommendations**:
- Rename "Active Projects" card to use the configurable Project-entity label (e.g., "Active Orders," "Active Cases").
- Replace the fixed 4-card layout with a **KPI card library** the admin picks from: Revenue, Client/Customer Count, Open Records (Projects/Orders/Cases), Pending Payments, Staff Count, Occupancy/Utilization Rate, Average Order Value, Inventory Level — each with its own data source, so an admin selects 3–6 relevant cards instead of getting fixed agency metrics.
- Rename "Web & Software" ring to a generic **"Completion Rate"** label, calculated the same way (published/total) but described in the org's own terms.
- Keep "Customer Growth" and "On-time" rings — both calculations are industry-neutral (they just count and compare dates); only the label needs to follow the configurable entity name.
- Filter Period dropdown: no change needed — already universal.

### 3.2 Customer Management → "Contacts" (configurable label)

**Current fields**: Profile Photo, Full Name, Email, Phone, Company Name, Address, Service (single dropdown), Status (Active/Inactive).

**Recommendations**:
- **Rename module** per the Business Type profile (Patients, Guests, Members, Students, Donors, Clients).
- **Company Name**: make optional/hidden per profile — irrelevant for consumer-facing orgs (café, hospital, school) but essential for B2B (agencies, manufacturers, logistics). Relabel to "Organization / Referred By" when shown, since NGOs and hospitals use this field for "referring organization," not "employer."
- **Service (single dropdown)** → change to a **multi-select** linked to the Services module, since a patient can have multiple treatments, a member can be enrolled in multiple programs, and a customer can have multiple past orders.
- **Status**: replace the hardcoded Active/Inactive with the **configurable status list** (e.g., healthcare: Admitted/Discharged/Referred; education: Enrolled/Graduated/Withdrawn; retail: Active/Lapsed/VIP).
- **Add (as optional/custom fields, not forced)**: Date of Birth (healthcare/education), Preferred Contact Method, Customer/Contact Type (Individual vs. Organization toggle), Tags/Segment, Loyalty or Membership ID (retail/hospitality).
- Search bar and filters: keep structurally identical, just point at whichever fields are enabled for the active profile.

### 3.3 Projects / Portfolio → "Records" (heaviest rework needed)

This module is the most agency-specific part of the system and needs the most restructuring. Recommend renaming per profile to: Projects (construction/agencies), Orders (retail/manufacturing), Bookings/Reservations (café/hospitality), Cases (healthcare/legal/NGO), Courses/Sections (education), Shipments (logistics).

**Current fields and treatment**:

| Field | Keep? | Change |
|---|---|---|
| Thumbnail | Keep | Relabel "Cover Image" |
| Title | Keep | Relabel "Name/Title" |
| Slug | **Make optional, hidden by default** | Only relevant to orgs that publish a public portfolio page (agencies, construction, some retail); irrelevant to a hospital case or café reservation |
| Description | Keep | — |
| Category | Keep | Link to Category module as today |
| Customer | Keep | Rename per configurable Contact label |
| Team | Keep | Rename to "Assigned Staff" |
| Service | Keep | Rename "Service/Product," allow multi-select |
| Status | Keep, but **configurable list** | Replace fixed Published/Draft with per-industry workflow states (In Progress, Completed, Delivered, Cancelled, Admitted, Reserved, etc.) |
| Start Date / End Date | Keep | Doubles as appointment time, reservation window, delivery window, project timeline — already generic |
| Budget | Keep | Rename "Amount/Value" — same field serves order total, project budget, or case cost |
| Live URL | **Hide by default** | Show only for orgs with a public project page (agencies/construction); irrelevant to café orders or hospital cases |
| Gallery | Keep, relabel "Photos" | Genuinely universal — construction progress photos, dish photos, product photos, before/after case photos |
| Technologies (multi-select) | **Rename & re-scope** | Convert to a generic **Tags/Attributes** multi-select whose vocabulary is admin-defined per profile (construction: materials used; retail: product tags; restaurant: dietary tags/allergens; logistics: cargo type) |
| Overview / Highlights / Challenges / Solutions / Features / Results (rich case-study fields) | **Make an optional "Case Study" section**, off by default | These are agency-portfolio-specific. Toggle on only for profiles that publish public case studies (agencies, construction). For other profiles, replace with a simpler generic "Internal Notes" field |

**New optional fields to offer** (via custom fields engine, not forced into the base schema): Quantity, Priority, Room/Table/Site Location, Order Line Items (see Invoices below), Appointment/Delivery Time.

### 3.4 Team Management

Already close to universal. Minor changes:

- **Social Media URLs** (Facebook/Twitter/Instagram/LinkedIn/Website): make this **optional per profile** — appropriate for agencies with public "meet the team" pages, unnecessary for hospital or warehouse back-office staff. Add a toggle: "Show on public website."
- **Department**: change from free-text to a **configurable Department list** (linked, not a raw string), so filters stay consistent and departments reflect the org (Kitchen, Front of House, Nursing, Radiology, Warehouse, Site Crew A) instead of implying an agency org chart.
- **Add as optional/custom fields**: Employee ID, Shift/Schedule, Certifications or Licenses (food safety, medical, driving) — flag these for careful data handling since they may be sensitive.
- **Skills** tag field: keep as-is, relabel "Skills / Specializations" — already industry-neutral.

### 3.5 Services Management → "Offerings" (configurable label)

Rename per profile: Services (agencies/professional services), Products (retail/manufacturing), Menu Items (café/restaurant), Programs (NGOs/schools), Treatments (healthcare).

**Recommendations**:
- Title, Description, Thumbnail, Featured toggle, Category, Base Price: all keep as-is — already universal.
- **Add as optional/custom fields** (not baked into the base schema for every org): SKU/Item Code (retail/manufacturing), Unit of Measure, Stock/Inventory Quantity (retail/manufacturing/café), Duration (consulting hours, spa/haircut slots), Variants (size/flavor/color options), Tax Class, Allergen Info (restaurant).
- These extras should be surfaced through the custom fields engine and pre-populated by the chosen Industry Profile, so a café gets "Allergens" pre-suggested and a manufacturer gets "SKU" pre-suggested, without cluttering unrelated profiles.

### 3.6 Careers / Job Vacancies

Already close to universal — every organization type hires. Recommendations:
- **Department dropdown**: currently hardcoded to `Developer, Design, Marketing, Operations, Sales, HR, Quality Assurance`. Change to pull from the same **configurable Department list** used by Team Management, so postings reflect real departments (Kitchen Staff, Nursing, Site Engineering, Sales Floor).
- Keep Employment Type, Work Mode, Salary, Deadline, Tags/Skills, Thumbnail as-is — genuinely universal.
- **Add as optional fields**: Shift Type (hourly/retail/hospitality roles), Required License/Certification (healthcare, food handling, commercial driving).

### 3.7 Analytics

Currently a placeholder. When built out, apply the same **KPI card library** concept as the Dashboard (Section 3.1) rather than hardcoding agency metrics — no other changes needed at this stage.

### 3.8 Invoices

Already largely universal (billing applies everywhere). Recommendations:
- **Category** (free text): link to a configurable list instead (Consulting, Product Sale, Room Charge, Tuition, Donation, Repair Service) so it's consistent and filterable.
- **Projects (multi-select linking)**: generalize the label to match whatever the Projects/Records module is renamed to.
- **Add Payment Method** field (Cash, Card, Bank Transfer, Mobile Wallet) — important for retail/café/hospitality where invoices are often settled on the spot, not just tracked as receivables.
- **Add itemized line items** (item name, quantity, unit price) as an option instead of a single lump Amount + Tax. Retail, café, and manufacturing typically need itemized receipts; consulting/agency invoicing is fine with a lump sum. Make line items a toggle, not a forced structure.
- **Currency**: currently hardcoded to "Rs." Move to a **Currency** field in Settings > General so the platform supports orgs outside a single currency/locale.
- Status list (Paid/Pending/Overdue): keep as default, but make it part of the configurable status workflow described in Section 1.4 so orgs can add states like "Partially Paid" or "Refunded."

### 3.9 Blog Management

Already universal — every organization can publish updates/news. Minor:
- **Category** (free text) → link to the Category module for consistency with other modules.
- Optionally relabel the module "News / Articles / Updates" per profile, but no structural changes needed.

### 3.10 Pages Management

Fully generic CMS page builder already — no organization-type assumptions exist here. No changes recommended beyond what's already planned platform-wide (configurable labels don't apply since this module has no entity-specific fields).

### 3.11 Category Management

Already universal — a general-purpose taxonomy used across other modules. One change:
- **Parent Category dropdown** currently hardcodes `Services, Careers, Invoices, Blogs, Pages`. Change this to **dynamically list every enabled module** (including newly renamed/relabeled ones, and Team Departments if categorization is extended there), so the option list stays correct as modules are renamed or toggled on/off per Industry Profile.

### 3.12 Website Setup (sidebar group)

| Sub-page | Verdict | Changes |
|---|---|---|
| Website Header | Universal | No changes — nav menu, sticky header, help number apply to any public site |
| Footer Widgets | Universal | No changes — logo, link columns, social links, app links, payment logos all apply broadly |
| Our Partners | Universal | No changes — any org can showcase partners/sponsors/affiliates |
| **Technologies Used** | **IT-specific — rework** | Rename to a generic **"Logo Showcase" / "Certifications & Accreditations"** module. Same underlying structure (image array), but reframed to also hold: certifications/ISO marks (manufacturing), food safety or health accreditation logos (restaurants/healthcare), equipment/brand logos (construction), accreditation bodies (schools/NGOs) — not just a software tech stack |
| FAQ | Universal | No changes |
| Add New Page | Universal | No changes |

### 3.13 Settings

| Sub-page | Verdict | Changes |
|---|---|---|
| **General** | Add fields | Add the **Industry Profile** selector (Section 1.1) and a **Currency** + **Date/Number Format** field (currently invoice currency is hardcoded) |
| Contact | Mostly universal | Optionally relabel "Office Hours" to "Operating Hours" for retail/hospitality profiles — cosmetic only |
| Email (SMTP) | Universal | No changes |
| Social | Universal | No changes |
| Security | Universal | No changes |
| Appearance | Universal | No changes |
| SEO | Universal | No changes |
| Popup | Universal | No changes |
| Cookies | Universal | No changes |

### 3.14 Global Navigation & Sidebar

- Sidebar logo text ("Going Genius / Group of Companies") should always be **pulled dynamically from Settings > General** (Site Title) rather than any hardcoded brand string, so it reflects whichever organization is running the platform.
- Sidebar navigation labels (Customer, Projects, Services, Careers, etc.) must reflect the **configurable entity labels** chosen under the active Industry Profile — the nav order and icons can stay the same, only the text changes.

### 3.15 Authentication Pages (Login, Onboarding)

Fully organization-agnostic already. No changes needed.

---

## 4. Data Model Implications (Summary)

- Add a **`labelOverrides`** table/setting: entity key → singular label, plural label, per-tenant.
- Add a **`customFields`** table: module key, field key, label, type, options (for dropdowns), required flag, display order, per-tenant.
- Add a **`statusOptions`** table: module key, status value, display label, color, sort order, default flag — replacing hardcoded enums like `Published/Draft` and `Active/Inactive` with editable lists.
- Add an **`industryProfile`** setting on `generalSetting`, plus a small preset lookup (not a database table necessarily — can ship as static config) mapping profile → default labels, default enabled/disabled fields, and suggested custom fields.
- Existing fields that become "hide-if-irrelevant" (Slug, Live URL, Gallery, Technologies, case-study rich-text fields on Projects; Company Name on Customers; social URLs on Team) should be marked **optional/nullable and conditionally rendered**, not removed — this preserves data for organizations (like the original IT agency) that still want them, while hiding them for organizations that don't.

---

## 5. What Does *Not* Need to Change

To be clear about scope, these modules and mechanics are already organization-agnostic and require no rework: **Pages Management, Blog Management (structurally), Category Management (aside from the dynamic parent list), FAQ, Website Header, Footer Widgets, Our Partners, all of Settings except General, the Sidebar/Topbar mechanics, Login, and Onboarding.** The redesign effort concentrates almost entirely on **Customer Management, Projects/Portfolio, Services, Team, Careers, Invoices, and the Dashboard KPI set** — plus the four cross-cutting systems in Section 1 that make all of the above configurable instead of hardcoded.
