# Implementation Plan Overview

## Phase 1: Core Infrastructure (Tasks 1–5)

Build the foundational configuration system.

### Objectives

* Create new database tables for:

  * Label overrides
  * Custom fields
  * Status workflows
  * Industry profiles
* Add a centralized configuration file with **11+ industry presets**, including:

  * IT & Software
  * Restaurant
  * Healthcare
  * Retail
  * Construction
  * Manufacturing
  * Education
  * Real Estate
  * Logistics
  * Hospitality
  * Professional Services
* Implement server actions/API for managing all configuration data.

---

## Phase 2: Dashboard & Settings (Tasks 6–9)

Make the admin dashboard and settings fully configurable.

### Objectives

* Add an **Industry Profile** selector in **Settings → General**.
* Replace hardcoded labels throughout the codebase (**50+ files**).
* Transform the Dashboard from fixed agency KPIs into a configurable card library.
* Make all charts, metrics, and dashboard terminology dynamic.

---

## Phase 3–4: Customer & Projects Modules (Tasks 10–15)

Refactor the two largest modules to support every industry.

### Customer Module

* Support multi-select Services.
* Add configurable customer status workflows.
* Conditionally display the **Company Name** field.

### Projects Module

* Allow renaming **Projects** based on industry:

  * Orders
  * Bookings
  * Cases
  * Shipments
  * etc.
* Make **Slug**, **Live URL**, and **Case Study** fields optional.
* Replace **Technologies** with a generic **Tags** system.
* Add configurable workflow states.

---

## Phase 5–6: Services, Team, Careers & Invoices (Tasks 16–20)

Generalize business-specific modules.

### Services

* Support industry-specific custom fields such as:

  * SKU
  * Inventory
  * Allergens
  * Duration
  * Service Type

### Team

* Conditionally show social profile URLs.
* Link members to Departments.
* Support certifications and qualifications.

### Careers

* Replace static departments with a dynamic Department dropdown.

### Invoices

* Support both:

  * Line-item invoices
  * Lump-sum invoices
* Add configurable currencies.
* Add configurable payment methods.

---

## Phase 7–8: Content & Website Setup (Tasks 21–23)

Make content modules industry agnostic.

### Objectives

* Make Category parent dropdown dynamic based on enabled modules.
* Convert **Technologies** into a **Logo Showcase** module.
* Verify Blog compatibility with dynamic categories.

---

## Phase 9–10: New Settings Pages & Navigation (Tasks 24–27)

Expand system configuration.

### Objectives

* Add **Settings → Departments**.
* Add **Settings → Tags & Attributes**.
* Make sidebar navigation fully configuration-driven.
* Update all search placeholders dynamically.

---

## Phase 11–12: Migration & Documentation (Tasks 28–31)

Ensure smooth adoption for existing installations.

### Objectives

* Create migration scripts for existing databases.
* Default all existing installations to the **IT & Software** profile.
* Add Import/Export functionality for configuration.
* Create per-industry setup guides.
* Add contextual help tooltips throughout the admin panel.

---

## Phase 13: Testing & Performance (Tasks 32–33)

Finalize stability and optimization.

### Objectives

* Implement end-to-end testing for profile switching.
* Add a caching layer for configuration lookups.

---

# Key Architectural Decisions

* ✅ **No Data Loss**
  Hidden fields remain stored in the database and are only conditionally rendered.

* ✅ **Backward Compatible**
  Existing IT/agency installations automatically default to the **IT & Software** profile.

* ✅ **Single Codebase**
  All industries share the same codebase and differ only through configuration.

* ✅ **Gradual Adoption**
  Each phase is independently deployable, allowing incremental implementation without disrupting existing functionality.
