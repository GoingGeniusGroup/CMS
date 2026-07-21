# Client-Side Image Size Guide

This document outlines the standard image sizes, aspect ratios, and styles used across the public client-side website (frontend).

---

## 1. Hero Sections

All main page hero sections feature a large banner/promotional image. These are consistently designed to occupy a standard landscape canvas:

- **Dimensions / Aspect Ratio:** `4:3` (Landscape)
- **CSS / Next.js Image Config:**
  - Container style: `relative aspect-[4/3] overflow-hidden rounded-2xl`
  - Image class: `object-cover`
- **Locations:**
  - Landing Hero Section (e.g., [HomeClient.tsx](file:///home/stranger/Documents/cms/app/(user)/home/HomeClient.tsx#L103))
  - Blogs Hero Section (e.g., [page.tsx](file:///home/stranger/Documents/cms/app/(user)/blogs/page.tsx#L39))

---

## 2. Projects & Portfolio

Project previews, thumbnails, and showcases use a standard layout to make mockups, widescreen images, or project photos look premium.

### Featured Projects & Projects Grid
- **Dimensions / Aspect Ratio:** `3:2` (Landscape representation of 2:3 style)
- **CSS / Next.js Image Config:**
  - Container style: `relative aspect-[3/2] overflow-hidden rounded-xl bg-zinc-50`
  - Image class: `object-cover`
- **Locations:**
  - [LandingFeaturedProjects.tsx](file:///home/stranger/Documents/cms/components/LandingFeaturedProjects.tsx#L61)
  - [ProjectsGrid.tsx](file:///home/stranger/Documents/cms/app/(user)/our-projects/ProjectsGrid.tsx#L29)

---

## 3. Team Member Cards

Smaller cards featuring human faces or avatars are standardized as square portraits.

- **Dimensions / Aspect Ratio:** `1:1` (Square)
- **CSS / Next.js Image Config:**
  - Container style: `relative aspect-square w-full bg-zinc-50`
  - Image class: `object-cover`
- **Locations:**
  - Public Teams Listing Page (e.g., [page.tsx](file:///home/stranger/Documents/cms/app/(user)/teams/page.tsx#L86))
  - [LandingTeamSection.tsx](file:///home/stranger/Documents/cms/components/LandingTeamSection.tsx#L80)

---

## 4. Services Sections

Services are presented as either grid cards or interactive flip cards with smaller icon-like thumbnails.

### Service Grid Thumbnail (Landing / Overview)
- **Dimensions / Aspect Ratio:** `1:1` (Square)
- **CSS / Next.js Image Config:**
  - Container style: `mx-auto mb-5 aspect-square w-full overflow-hidden rounded-xl relative bg-zinc-50 border border-zinc-100`
  - Image class: `object-cover`
- **Locations:**
  - [LandingServicesSection.tsx](file:///home/stranger/Documents/cms/components/LandingServicesSection.tsx#L56)

### Service Flip Cards (Small & Large)
- **Dimensions / Aspect Ratio:** `1:1` (Square)
- **CSS / Next.js Image Config:**
  - `FlipCardSmall` Image Container: `relative aspect-square h-20 w-20 mx-auto overflow-hidden rounded-xl bg-zinc-50 border border-zinc-100 shrink-0`
  - `FlipCardLarge` Image Container: `relative aspect-square h-24 w-24 mx-auto overflow-hidden rounded-xl bg-zinc-50 border border-zinc-100 shrink-0`
- **Locations:**
  - [ServicesSection.tsx](file:///home/stranger/Documents/cms/app/(user)/our-services/ServicesSection.tsx#L70)

---

## 5. Blogs & Articles

Blog thumbnails use a cinema/widescreen aspect ratio that fits rich cover photography.

- **Dimensions / Aspect Ratio:** `16:10` (Landscape)
- **CSS / Next.js Image Config:**
  - Container style: `relative aspect-[16/10]`
  - Image class: `object-cover`
- **Locations:**
  - Featured Article Banner (e.g., [page.tsx](file:///home/stranger/Documents/cms/app/(user)/blogs/page.tsx#L61))
  - Article Grid Cards (e.g., [page.tsx](file:///home/stranger/Documents/cms/app/(user)/blogs/page.tsx#L107))

---

## 6. Partners & Tech Logos

Company logos and tech stack badges are fitted fully within small banner ribbons.

- **Dimensions / Aspect Ratio:** Variable / Auto width (Fitted)
- **CSS / Next.js Image Config:**
  - Container style: `flex flex-wrap items-center justify-center gap-8`
  - Image class: `h-10 w-auto max-w-[140px] object-contain`
- **Locations:**
  - [LandingPartnersSection.tsx](file:///home/stranger/Documents/cms/components/LandingPartnersSection.tsx#L25)
  - Home Page Tech Stack (e.g., [HomeClient.tsx](file:///home/stranger/Documents/cms/app/(user)/home/HomeClient.tsx#L137))
