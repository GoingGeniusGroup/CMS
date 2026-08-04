# Migration Guide — Adopting the Configurable/Multi-Industry Layer

This guide is for **existing installations** of the CMS (deployed before the Organization-Agnostic Redesign) that want to safely adopt the new configuration layer: dynamic labels, custom fields, status workflows, industry profiles, and multi-currency invoices.

If you're setting up a **brand-new** installation, you can skip most of this — just follow "New Installations" below.

---

## Is This Migration Safe?

**Yes.** Every change introduced by this redesign is additive:
- New Prisma models (`LabelOverride`, `CustomField`, `CustomFieldValue`, `StatusOption`, `Department`) — no existing tables were dropped or renamed.
- New columns on `GeneralSetting` (`industryProfile`, `currency`, `currencySymbol`, `dateFormat`, `numberFormat`) — all have safe defaults.
- All UI components fall back to hardcoded defaults when no configuration exists yet (e.g. `useEntityLabel("customer")` returns `"Customer"` if no override/profile has been applied).

**Nothing breaks if you skip the seed step.** The app works exactly as before; you just won't have the new customization options populated until you seed them.

---

## New Installations

1. Run migrations: `npx prisma migrate deploy` (or `npx prisma db push` in dev)
2. Seed the configuration layer: `npm run seed-config`
3. Log in → Settings > General → pick an Industry Profile
4. Optionally customize labels, custom fields, and status workflows in Settings

That's it — done.

---

## Existing Installations — Step by Step

### Step 1: Back Up Your Database
Before running any migration against production data:
```bash
pg_dump "$DATABASE_URL" > backup-before-config-layer.sql
```

### Step 2: Apply the Schema Migration
```bash
npx prisma migrate deploy
```
This adds the new tables/columns described above. Existing data is untouched.

### Step 3: Seed Sensible Defaults
```bash
npm run seed-config
```
This script (`prisma/seed-config.ts`) is **idempotent** — safe to re-run:
- Seeds `LabelOverride` rows matching your current hardcoded labels (so nothing visually changes yet)
- Seeds `StatusOption` rows matching your current hardcoded statuses (Draft/Published, Active/Inactive, etc.)
- If `GeneralSetting.industryProfile` is already set to a non-"Custom" profile, seeds that profile's suggested custom fields as **inactive** entries (they won't show in forms until an admin activates them in Settings > Custom Fields)

### Step 4: Verify Nothing Changed Visually
Because the seed step mirrors your existing hardcoded labels/statuses 1:1, the admin panel and public site should look **identical** immediately after migration. Confirm:
- Dashboard still shows the same terminology
- Customer/Project/Service/Team/Invoice pages unchanged
- No new required fields appear in forms

### Step 5: Opt In to Customization (Optional, Whenever You're Ready)
- **Settings > General:** Select an industry profile to adopt its terminology and suggested fields
- **Settings > Labels:** Override any individual entity label
- **Settings > Custom Fields:** Activate the seeded suggestions relevant to your business, or add your own
- **Settings > Status Workflows:** Adjust status lists per module
- **Settings > Departments / Tags:** Curate department and tag vocabularies
- **Settings > General → Currency:** Set your currency symbol so invoices print correctly

---

## Rollback Plan

If you need to roll back after migrating:
1. The new tables/columns are additive — you can leave them in place without any functional impact even if you revert the application code to a pre-redesign version.
2. If you must remove them: `npx prisma migrate resolve` workflows are out of scope here — restore from the Step 1 backup instead, since destructive schema rollback on a live DB carries real data-loss risk and should be done deliberately, not via a generic script.

---

## FAQ

**Q: Will my existing customers/projects/invoices be affected?**
A: No. Only configuration/metadata tables are added. Your business data (`Customer`, `Project`, `Invoice`, etc. rows) is untouched.

**Q: What if I never run `seed-config`?**
A: The app keeps working with hardcoded English defaults, same as before this redesign. The new Settings pages (Labels, Custom Fields, Status, Departments, Tags) will simply start empty, and you can populate them manually at any time.

**Q: Can I switch industry profiles more than once?**
A: Yes. Selecting a new profile in Settings > General only seeds **new** suggested defaults — it never deletes or overwrites labels/fields you've already customized.

**Q: Does this require downtime?**
A: No. The migration is a standard additive Prisma migration; no locking operations on existing large tables are performed.
