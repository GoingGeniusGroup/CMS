# Remaining Sections Customization Plan

Make all remaining hardcoded sections admin-editable via **Website Setup > Page Content** using the existing `SECTION_REGISTRY` + `getSection()` + `SiteContent` table pattern.

---

## Phase 1 — Portfolio Stats + Services Page Headers

**Effort:** Small  
**Pages:** `/portfolio`, `/our-services`

### Task 1.1: Portfolio Stats Section
- Add `"portfolio.stats"` to `SECTION_REGISTRY` (kind: `stats`, same pattern as `our-projects.stats`)
- Default data: `[{ value: "6+", label: "Years Experience" }, { value: "120+", label: "Happy Clients" }]` + the two dynamic ones
- Update `app/(user)/portfolio/page.tsx` to fetch `getSection("portfolio", "portfolio.stats")` and render via `<StatsSection>`
- Remove the inline hardcoded stats array

### Task 1.2: Services Page — FeaturedServicesGrid Header
- Add `"our-services.featuredHeader"` to `SECTION_REGISTRY` (kind: `sectionHeader`)
- Default data: `{ eyebrow: "WHAT WE DO", heading: "Our Digital Services", Subheading: "We build digital products..." }`
- Update `components/FeaturedServicesGrid.tsx` to accept `headerData` prop and render via `<SectionHeader>`
- Pass the section data from `app/(user)/our-services/page.tsx`

### Task 1.3: Services Page — ServicesGrid Header
- Add `"our-services.servicesHeader"` to `SECTION_REGISTRY` (kind: `sectionHeader`)
- Default data: `{ eyebrow: "SERVICES WE PROVIDE" }`
- Update `components/ServicesGrid.tsx` to accept `headerData` prop
- Pass from `app/(user)/our-services/page.tsx`

---

## Phase 2 — Teams Page Join CTA

**Effort:** Small  
**Pages:** `/teams`

### Task 2.1: Teams Join CTA Section
- Add `"teams.cta"` to `SECTION_REGISTRY` (kind: `cta`)
- Default data: `{ variant: "centered", headingLines: ["Want to join our genius team?"], Subheading: "We're always looking for talented people...", primaryCtaLabel: "View Open Positions", primaryCtaHref: "/career", secondaryCtaLabel: "Send Your CV", secondaryCtaHref: "/career" }`
- Update `app/(user)/teams/page.tsx` to fetch and render via `<CtaSection>` instead of the hardcoded block
- Remove the inline hardcoded CTA JSX

---

## Phase 3 — Career Page Headings

**Effort:** Small  
**Pages:** `/career`

### Task 3.1: Career Open Positions Header
- Add `"career.positions"` to `SECTION_REGISTRY` (kind: `sectionHeader`)
- Default data: `{ heading: "Open Positions", Subheading: "Explore opportunities to make an impact." }`
- Update the `OpenPositions` component in `app/(user)/career/page.tsx` to accept `headerData` and render from it
- Fetch via `getSection("career", "career.positions")`

---

## Phase 4 — Contact Page Form & Map

**Effort:** Medium  
**Pages:** `/contact`

### Task 4.1: Contact Form Header
- Add `"contact.formHeader"` to `SECTION_REGISTRY` (kind: `sectionHeader`)
- Default data: `{ heading: "Get In Touch", Subheading: "Have a project in mind or need expert advice? We'd love to hear from you..." }`
- Update `ContactClient.tsx` → `ContactSection` to read heading/subheading from section data

### Task 4.2: Contact Map Section Header
- Add `"contact.mapHeader"` to `SECTION_REGISTRY` (kind: `sectionHeader`)
- Default data: `{ heading: "Our Location", Subheading: "Visit us at our office for a face-to-face meeting." }`
- Update the map section in `ContactClient.tsx` to use section data

### Task 4.3: Budget Options (Settings-based)
- Add a `budgetOptions` field to `ContactSetting` model (JSON array of strings)
- Default: `["Under $5k", "$5k – $10k", "$10k – $25k", "$25k – $50k", "$50k+", "Not sure"]`
- Add UI in `/settings/contact` to manage budget options
- Update `ContactClient.tsx` to receive and use the dynamic list

---

## Phase 5 — Contact Thank You Page

**Effort:** Medium  
**Pages:** `/contact/thank-you`

### Task 5.1: Thank You Content Section
- Add `"contact.thankYou"` to `SECTION_REGISTRY` (kind: `sectionHeader`)
- Fields: `heading: "Thank You!"`, `Subheading: "Your message has been received."` + extend with a `copy` field or use the existing schema
- Update `app/(user)/contact/thank-you/page.tsx` to fetch and render dynamically

### Task 5.2: Thank You Info Cards
- Add `"contact.thankYouCards"` to `SECTION_REGISTRY` (kind: `cards`)
- Default items: `[{ title: "What happens next?", description: "Our team will review..." }, { title: "Quick Response", description: "We typically reply within 24 hours" }, { title: "Need Immediate Help?", description: "Call us at..." }]`
- Render via `<CardsSection>` or a simple map

---

## Phase 6 — Blog Page Sidebar

**Effort:** Medium  
**Pages:** `/blogs`

### Task 6.1: Blog Sidebar Headers
- Add `"blogs.sidebar"` to `SECTION_REGISTRY` (kind: `sectionHeader` or new kind)
- Fields: search heading, popular heading, subscribe heading, subscribe copy, tags heading
- Default: current hardcoded strings
- Update `app/(user)/blogs/page.tsx` sidebar to use section data

### Task 6.2: Blog Tags (Auto-derived)
- Replace the hardcoded tags array with a DB query: extract distinct tags from published blogs
- No admin page needed — tags auto-derive from blog content

### Task 6.3: Blog Collections (Settings-based)
- Add a `"blog-collections"` setting (via `saveSetting` / `getSetting`)
- Data shape: `{ collections: [{ label: string, count?: number, color: string }] }`
- Add UI in blog admin or a dedicated settings section
- Update the sidebar to read from the setting

### Task 6.4: Blog Section Headers
- Add `"blogs.featured"` to `SECTION_REGISTRY` (kind: `sectionHeader`)
- Default: `{ heading: "Featured Article", Subheading: "Handpicked insights..." }`
- Update the hardcoded heading in the blog page

---

## Phase 7 — Career Apply Page

**Effort:** Medium  
**Pages:** `/career/apply`

### Task 7.1: Application Form Config (Settings-based)
- Add fields to a `CareerSetting` or the existing `Setting` table:
  - `locationOptions: string[]` — default: `["Kathmandu, Nepal", "Pokhara, Nepal", "Remote", "Other"]`
  - `experienceOptions: string[]` — default: `["Entry Level", "1-2 years", "3-5 years", "5+ years"]`
- Add UI in `/settings` or as part of the Careers admin
- Update `app/(user)/career/apply/page.tsx` to fetch and use dynamic options

### Task 7.2: Need Help Sidebar Contact Info
- Replace hardcoded email/phone with values from `getPublicContactSettings()`
- Already available via the contact settings action, just needs wiring

### Task 7.3: Fallback Content
- When a job has no responsibilities/skills, the page shows hardcoded fallbacks
- Make these configurable via career settings or leave as sensible defaults (low priority)

---

## Priority Order

| Phase | Pages | Effort | Impact |
|-------|-------|--------|--------|
| 1 | Portfolio, Services | Small | High — visible sections on key pages |
| 2 | Teams | Small | Medium — single CTA block |
| 3 | Career | Small | Medium — single heading |
| 4 | Contact | Medium | High — main contact page content |
| 5 | Thank You | Medium | Low — seen only after form submit |
| 6 | Blog Sidebar | Medium | Medium — affects blog UX |
| 7 | Career Apply | Medium | Low — form config, not public content |

---

## Implementation Notes

- All new `SECTION_REGISTRY` entries **auto-appear** in the admin Page Content editor (no extra UI work needed for the editor)
- Existing editor forms (`SectionHeaderForm`, `HeroForm`, `CardsForm`, `StatsForm`, `CtaForm`) cover all the kinds listed above
- Run `npm run seed-site-content` after adding registry entries to seed default rows into the DB
- Each phase is independently deployable — no cross-phase dependencies
- Total: ~15 new registry entries across 7 phases
