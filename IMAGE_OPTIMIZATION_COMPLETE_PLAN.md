# Image Optimization - Complete Implementation Plan

> **Status**: Analysis complete - Ready for implementation
> **Created**: Based on comprehensive codebase audit
> **Scope**: All image components across client website and admin panel

---

## Executive Summary

This plan addresses image display issues across the entire CMS:
- **Hero Section**: Left-side cropping on landing/project pages
- **Service Cards**: Black background flash during image load
- **Admin Panel**: White screen bug (images invisible on white background)
- **Card Sizing**: Inconsistent heights and aspect ratios across pages
- **Image Quality**: Missing Next.js Image optimization in some areas
- **User Experience**: Upload preview too small to judge final appearance


---

## Current Implementation Status

### ✅ What's Working
- Blog pages using proper `aspect-[16/9]` and `object-cover`
- Career page has one image with `object-center` applied
- No raw `<img>` tags in client pages (all using Next.js Image)
- ImageUploader shows preview (though too small)

### ⚠️ What Needs Fixing

#### Critical Issues (User-Facing)
1. **Hero images lack `object-center`** → crops from left on narrow viewports
2. **ShowcaseCard has fixed height** → `h-[340px]` breaks responsive design
3. **Admin card views use `object-contain`** → white-on-white invisibility bug
4. **Career page has `objectFit: fill`** → distorts career3.png image


#### Quality Issues
5. **Projects grid on /our-projects** → needs `object-center` + better aspect ratio
6. **ViewDetailModal** → fixed `h-48` crops images arbitrarily
7. **ImageUploader preview** → `h-16 w-16` too small to judge result
8. **Admin thumbnails** → inconsistent sizing between services/projects/team
9. **Blog `sizes` props** → using `100vw` when cards are 33vw (wastes bandwidth)

---

## Design Standards (Target State)

### Universal Image Rules

| Context | Aspect Ratio | object-fit | object-position | Background | Priority |
|---------|-------------|-----------|----------------|-----------|----------|
| Hero sections | `4:3` | cover | **center** | transparent | yes |
| Showcase cards (Services/Projects/Blogs) | `3:2` | cover | **center** | `bg-zinc-100` | no |
| Team portraits (client + admin) | `1:1` | cover | **top** | `bg-zinc-50` | no |
| Admin card view (Services/Projects) | `16:9` | cover | **center** | `bg-zinc-100` | no |
| Admin card view (Team/Customer) | `1:1` | cover | **top** | `bg-zinc-100` | no |
| Admin list thumbnail | fixed `h-10 w-14` | cover | center | `bg-zinc-100` | no |
| ViewDetailModal image | `16:9` | cover | **center** | `bg-zinc-100` | no |
| Logo/icon images | auto | **contain** | center | transparent | no |


### Key Principles
1. **`object-cover` for all photographs/user content** (fills container, crops excess)
2. **`object-contain` ONLY for logos/icons** (shows entire image, may leave space)
3. **Explicit `object-position`** on all images (prevents unpredictable cropping)
4. **Aspect ratio containers** over fixed heights (responsive across breakpoints)
5. **Background fallback** on all image containers (no flash during load)

---

## Implementation Plan

### Phase 1: Hero Image Fixes (Highest Priority)
**Impact**: Fixes visible cropping on landing page and project pages

**Files to modify**:
- `app/(user)/home/HomeClient.tsx` (line ~107)
- `app/(user)/our-projects/page.tsx` (HeroSection line ~63, CTASection line ~148)


**Changes**:
```diff
# HomeClient.tsx (line ~107)
- className="object-cover"
+ className="object-cover object-center"

# our-projects/page.tsx HeroSection (line ~63)
- className="object-cover"
+ className="object-cover object-center"

# our-projects/page.tsx CTASection (line ~148)
- className="object-cover"
+ className="object-cover object-center"
```

**Test**:
- [ ] Landing hero fills container completely at all viewport widths
- [ ] /our-projects hero image centered (no left-side crop)
- [ ] CTA section image centered


---

### Phase 2: ShowcaseCard Component Refactor
**Impact**: Fixes inconsistent card heights and adds proper image positioning

**File**: `components/ShowcaseCard.tsx`

**Changes**:
```diff
# Remove heightClassName prop (line ~29)
- heightClassName = "h-[340px]",

# Remove from props interface (line ~41)
- heightClassName?: string;

# Replace fixed height with aspect ratio (line ~43)
- const surfaceClasses = `group relative block w-full ${heightClassName} overflow-hidden...`
+ const surfaceClasses = `group relative block w-full aspect-[3/2] overflow-hidden...`

# Add object-center to Image (line ~53)
- className="object-cover transition-transform duration-500..."
+ className="object-cover object-center transition-transform duration-500..."
```


**Caller updates** (remove any `heightClassName` props if passed):
- `components/LandingServicesSection.tsx` ✅ (not passing heightClassName)
- `components/LandingFeaturedProjects.tsx` ✅ (not passing heightClassName)
- `components/LandingBlogSection.tsx` ✅ (not passing heightClassName)
- `components/ServicesGrid.tsx` - check if exists
- `components/ProjectsGrid.tsx` ✅ (uses ShowcaseCard, no heightClassName passed)

**Test**:
- [ ] All service cards same height in grid (4 across on desktop)
- [ ] All project cards same height in grid
- [ ] All blog cards same height in grid
- [ ] Cards scale proportionally on mobile (1 column)
- [ ] Images centered in containers, no unexpected cropping
- [ ] No black background flash during load


---
### Phase 3: Admin Panel - Fix White Screen Bug
**Impact**: Makes images visible in admin card views (critical UX bug)

#### 3A: Services Card View
**File**: `app/(app)/services/ServicesClient.tsx` (lines ~341-348)

```diff
- <div className="mb-4 aspect-square w-full relative bg-zinc-50 border border-zinc-100 rounded-xl overflow-hidden flex items-center justify-center">
+ <div className="mb-4 aspect-[16/9] w-full relative bg-zinc-100 rounded-xl overflow-hidden">
    {service.thumbnailUrl ? (
-     <img src={service.thumbnailUrl} alt={service.serviceName} className="h-full w-full object-contain" />
+     <img src={service.thumbnailUrl} alt={service.serviceName} className="h-full w-full object-cover object-center" />
    ) : (
      <div className="h-full w-full bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
    )}
  </div>
```


#### 3B: Projects Card View
**File**: `app/(app)/projects/ProjectsClient.tsx` (lines ~373-383)

```diff
- <div className="mb-4 aspect-square w-full relative bg-zinc-50 border border-zinc-100 rounded-xl overflow-hidden flex items-center justify-center">
+ <div className="mb-4 aspect-[16/9] w-full relative bg-zinc-100 rounded-xl overflow-hidden">
    {project.thumbnail ? (
-     <img src={project.thumbnail} alt={project.title} className="h-full w-full object-contain" />
+     <img src={project.thumbnail} alt={project.title} className="h-full w-full object-cover object-center" />
    ) : (
      <div className="h-full w-full bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
    )}
  </div>
```


#### 3C: Team Card View
**File**: `app/(app)/team/TeamClient.tsx` (lines ~431-437)

```diff
- <div className="w-full aspect-square relative bg-zinc-50 border border-zinc-100 rounded-xl overflow-hidden mb-1 flex items-center justify-center">
+ <div className="w-full aspect-square relative bg-zinc-100 rounded-xl overflow-hidden mb-1">
    {m.image ? (
-     <img src={m.image} alt={m.fullName} className="w-full h-full object-contain" />
+     <img src={m.image} alt={m.fullName} className="w-full h-full object-cover object-top" />
    ) : (
      <User className="h-12 w-12 text-zinc-300" />
    )}
  </div>
```

**Note**: Using `object-top` for team portraits keeps faces visible (not cropped at bottom).


#### 3D: Customer Card View
**File**: `app/(app)/customer/CustomersClient.tsx` (lines ~352-360)

```diff
- <div className="w-full aspect-square relative bg-zinc-50 border border-zinc-100 rounded-xl overflow-hidden mb-3 flex items-center justify-center">
+ <div className="w-full aspect-square relative bg-zinc-100 rounded-xl overflow-hidden mb-3">
    {customer.image ? (
-     <img src={customer.image} alt={customer.fullName} className="w-full h-full object-contain" />
+     <img src={customer.image} alt={customer.fullName} className="w-full h-full object-cover object-top" />
    ) : (
      <User className="h-12 w-12 text-zinc-300" />
    )}
  </div>
```

**Test**:
- [ ] Admin Services card view: images visible (no white screen)
- [ ] Admin Projects card view: images visible and properly cropped
- [ ] Admin Team card view: faces visible, not cut off at bottom
- [ ] Admin Customer card view: portraits properly displayed


---

### Phase 4: Client Projects Grid Enhancement
**Impact**: Better aspect ratio and positioning for project showcase

**File**: `app/(user)/our-projects/ProjectsGrid.tsx` (lines ~29-37)

```diff
  {project.thumbnail && (
-   <div className="relative aspect-[3/2] overflow-hidden bg-zinc-100">
+   <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100">
      <Image
        src={project.thumbnail}
        alt={project.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
-       className="object-cover transition-transform group-hover:scale-105"
+       className="object-cover object-center transition-transform group-hover:scale-105"
      />
    </div>
  )}
```

**Rationale**: 16:9 is more "showcase" friendly for project mockups/screenshots.


**Test**:
- [ ] /our-projects page shows grid with consistent widescre en cards
- [ ] Images centered and not cropped unexpectedly
- [ ] Cards scale properly on mobile

---

### Phase 5: Career Page Gallery Fix
**Impact**: Removes image distortion (career3.png currently stretched)

**File**: `app/(user)/career/page.tsx` LifeSection (lines ~119-152)

**Current issues**:
- career2.png: raw `<img>` ✅ has `object-center` but missing Next.js optimization
- career3.png: ❌ `objectFit: "fill"` distorts image
- career4.png: raw `<img>`, missing `object-center`


**Changes**:
```diff
+ import Image from "next/image"; // Add at top if not present

# career2 - upgrade to Next.js Image (line ~119-127)
- <div className="relative overflow-hidden rounded-2xl shadow-sm" style={{ gridRow: "1 / 3" }}>
+ <div className="relative overflow-hidden rounded-2xl shadow-sm" style={{ gridRow: "1 / 3" }}>
-   <img src="/career2.png" alt="Collaborative Environment" className="h-full w-full object-cover object-center" />
+   <Image src="/career2.png" alt="Collaborative Environment" fill sizes="66vw" className="object-cover object-center" />
    <span className="absolute bottom-4 left-4 text-sm font-semibold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
      Collaborative Environment
    </span>
  </div>

# career3 - fix distortion (line ~130-137)
- <div className="overflow-hidden rounded-2xl">
+ <div className="relative overflow-hidden rounded-2xl">
-   <img src="/career3.png" alt="Team" style={{ width: "100%", height: "100%", objectFit: "fill", display: "block" }} />
+   <Image src="/career3.png" alt="Team" fill sizes="33vw" className="object-cover object-center" />
  </div>

# career4 - upgrade to Next.js Image (line ~140-147)
- <div className="overflow-hidden rounded-2xl shadow-sm">
+ <div className="relative overflow-hidden rounded-2xl shadow-sm">
-   <img src="/career4.png" alt="Night Coding" className="h-full w-full object-cover" />
+   <Image src="/career4.png" alt="Night Coding" fill sizes="33vw" className="object-cover object-center" />
  </div>
```


**Test**:
- [ ] career3.png no longer stretched/distorted
- [ ] All three images properly proportioned
- [ ] Images load as WebP (Next.js optimization working)

---

### Phase 6: ViewDetailModal Image Fix
**Impact**: Modal images display at proper proportions (not artificially short)

**File**: `components/ViewDetailModal.tsx` (lines ~41-46)

```diff
  {imageUrl && (
-   <div className="mt-4 overflow-hidden rounded-xl">
+   <div className="mt-4 aspect-[16/9] relative overflow-hidden rounded-xl bg-zinc-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
-     <img src={imageUrl} alt={title} className="h-48 w-full object-cover" />
+     <img src={imageUrl} alt={title} className="h-full w-full object-cover object-center" />
    </div>
  )}
```


**Test**:
- [ ] Admin "View" modal shows full image at 16:9 ratio
- [ ] No arbitrary cropping at fixed height
- [ ] Background fallback shows during load

---

### Phase 7: ImageUploader Preview Enhancement
**Impact**: Better upload UX - users see how image will actually look

**File**: `components/ImageUploader.tsx` (lines ~50-56)

```diff
  {value && (
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
-     <img src={value} alt="Preview" className="h-16 w-16 rounded-lg object-cover border border-gray-200 shadow-sm" />
+     <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-gray-200 bg-zinc-100 shadow-sm">
+       {/* eslint-disable-next-line @next/next/no-img-element */}
+       <img src={value} alt="Preview" className="h-full w-full object-cover object-center" />
+     </div>

      <div className="flex flex-wrap items-center gap-2">
```


**Rationale**: Shows landscape preview matching how the image will appear in service/project/blog cards.

**Test**:
- [ ] Upload preview shows full-width landscape view
- [ ] Preview matches aspect ratio of actual card display
- [ ] User can judge image appearance before saving

---

### Phase 8: Admin List View Thumbnail Unification
**Impact**: Consistent thumbnail treatment across all admin list views

**Files**:
- `app/(app)/services/ServicesClient.tsx` (table row ~284)
- `app/(app)/projects/ProjectsClient.tsx` (table row ~310)

**Pattern to apply**:
```tsx
<div className="h-10 w-14 rounded-md overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
  {url
    ? <img src={url} className="h-full w-full object-cover" />
    : <div className="h-full w-full bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
  }
</div>
```


**Test**:
- [ ] Services table thumbnails consistent size and styling
- [ ] Projects table thumbnails match services pattern
- [ ] Gradient fallback shows when no image

---

### Phase 9: Blog Related Articles Optimization
**Impact**: Reduces bandwidth waste on blog pages

**File**: `app/(user)/blogs/[slug]/page.tsx`

#### 9A: Sidebar thumbnails (lines ~121-125)
```diff
- <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
-   <Image src={a.thumbnail} fill sizes="100vw" className="object-cover" />
+ <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
+   <Image src={a.thumbnail} fill sizes="80px" className="object-cover object-center" />
  </div>
```


#### 9B: Related articles grid (lines ~178-181)
```diff
  <Image 
    src={card.thumbnail} 
    fill 
-   sizes="100vw" 
-   className="object-cover" 
+   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
+   className="object-cover object-center"
  />
```

**Test**:
- [ ] Sidebar thumbnails properly sized (not square)
- [ ] Related articles use correct `sizes` (smaller images served)
- [ ] All images centered

---

### Phase 10: Admin Blog Card View
**Impact**: Ensure blog admin follows same pattern as other modules

**File**: `app/(app)/blog/BlogsClient.tsx` (line ~355-362)


**Verify current implementation** (should already be `aspect-[3/2]`):
```tsx
<div className="aspect-[3/2] w-full relative bg-zinc-50 border-b border-zinc-100 overflow-hidden">
  {blog.thumbnail ? (
    <img src={blog.thumbnail} alt={blog.title} className="h-full w-full object-cover" />
  ) : (
    <div className="h-full w-full bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
  )}
</div>
```

**If needed, add**:
- `object-center` to img className
- Change `bg-zinc-50` to `bg-zinc-100` for consistency

**Test**:
- [ ] Blog card view images visible and properly displayed
- [ ] Consistent with other admin card views


---

## File Modification Summary

### Client Website (`app/(user)/`)

| File | Phases | Line Range | Change Summary |
|------|--------|-----------|----------------|
| `home/HomeClient.tsx` | 1 | ~107 | Add `object-center` to hero Image |
| `our-projects/page.tsx` | 1, 4 | ~63, ~148 | Add `object-center` to hero & CTA images |
| `our-projects/ProjectsGrid.tsx` | 4 | ~29-37 | Change to `aspect-[16/9]`, add `object-center` |
| `career/page.tsx` | 5 | ~119-147 | Convert to Next.js Image, fix career3 distortion |
| `blogs/[slug]/page.tsx` | 9 | ~121-125, ~178-181 | Fix thumbnail sizes, optimize `sizes` prop |

### Shared Components (`components/`)

| File | Phase | Line Range | Change Summary |
|------|-------|-----------|----------------|
| `ShowcaseCard.tsx` | 2 | ~29, ~41, ~43, ~53 | Remove heightClassName, use aspect-[3/2], add object-center |
| `ViewDetailModal.tsx` | 6 | ~41-46 | Use aspect-[16/9], add object-center |
| `ImageUploader.tsx` | 7 | ~50-56 | Full-width preview instead of tiny square |


### Admin Panel (`app/(app)/`)

| File | Phase | Line Range | Change Summary |
|------|-------|-----------|----------------|
| `services/ServicesClient.tsx` | 3A, 8 | ~341-348, ~284 | Card: aspect-[16/9] + object-cover; List: unified container |
| `projects/ProjectsClient.tsx` | 3B, 8 | ~373-383, ~310 | Card: aspect-[16/9] + object-cover; List: unified container |
| `team/TeamClient.tsx` | 3C | ~431-437 | Card: object-cover + object-top for portraits |
| `customer/CustomersClient.tsx` | 3D | ~352-360 | Card: object-cover + object-top for portraits |
| `blog/BlogsClient.tsx` | 10 | ~355-362 | Verify object-center present |

---

## Testing Checklist

### Client Website
- [ ] Landing page hero: no left-side cropping at any viewport width
- [ ] Service cards (landing): all same height, images centered, no black flash
- [ ] Project cards (landing): all same height, images centered
- [ ] Blog cards (landing): all same height, images centered
- [ ] /our-projects hero: properly centered
- [ ] /our-projects grid: widescreen cards, uniform height
- [ ] /career Life section: career3.png no longer distorted
- [ ] /blogs sidebar: thumbnails properly sized (landscape not square)


### Admin Panel
- [ ] Services card view: images visible (no white screen)
- [ ] Services list view: thumbnails consistent
- [ ] Projects card view: images visible and widescreen
- [ ] Projects list view: thumbnails consistent
- [ ] Team card view: faces visible, not cropped at bottom
- [ ] Customer card view: portraits properly displayed
- [ ] Blog card view: images properly displayed
- [ ] ViewDetailModal: images at proper proportions

### Developer Experience
- [ ] ImageUploader preview: full-width landscape view matches final result
- [ ] All images use explicit object-position (no unexpected cropping)
- [ ] Background fallbacks on all containers (no flashes)
- [ ] Proper Next.js Image `sizes` props (bandwidth optimization)

---

## Execution Strategy

### Recommended Order
1. **Phase 1** → Quick win, highest visibility (hero fixes)
2. **Phase 2** → Foundation (ShowcaseCard affects multiple pages)
3. **Phase 3** → Critical bug (admin white screen)
4. **Phase 5** → Visual bug (career3 distortion)
5. **Phase 6-7** → UX improvements (modal + uploader)
6. **Phase 4, 8-10** → Polish and optimization


### Time Estimates
- **Phase 1**: 15 min (3 simple className additions)
- **Phase 2**: 30 min (component refactor + verify callers)
- **Phase 3**: 45 min (4 admin files, careful testing needed)
- **Phase 4**: 10 min (single file, small change)
- **Phase 5**: 30 min (3 images, import addition, careful CSS)
- **Phase 6**: 10 min (single file, small change)
- **Phase 7**: 15 min (restructure preview layout)
- **Phase 8**: 20 min (2 files, pattern application)
- **Phase 9**: 15 min (2 small changes)
- **Phase 10**: 10 min (verification only)

**Total**: ~3 hours (implementation + testing)

---

## Risk Assessment

### Low Risk
- Phase 1, 4, 6: Simple className additions
- Phase 10: Verification only

### Medium Risk
- Phase 2: Component refactor (but well-isolated)
- Phase 7: Layout restructure (preview only, not critical path)
- Phase 8-9: Multiple files but small changes


### Higher Risk
- Phase 3: Admin panel changes (test thoroughly, affects daily workflow)
- Phase 5: Career page (3 images, grid layout, ensure responsive)

### Mitigation
- Test each phase before proceeding to next
- Keep browser DevTools open to verify aspect ratios
- Test at multiple viewport sizes (mobile, tablet, desktop)
- Verify admin panel with actual user data

---

## Success Criteria

### Visual Quality
✅ No images cropped unexpectedly
✅ All card grids have uniform heights
✅ Images centered in containers
✅ No black/white background flashes
✅ Portraits show faces (not cropped at top/bottom)

### Technical Quality
✅ All photographs use `object-cover` (not `object-contain`)
✅ All images have explicit `object-position`
✅ Aspect ratio containers (not fixed pixel heights)
✅ Background fallbacks on all containers
✅ Proper Next.js Image optimization everywhere


### User Experience
✅ Upload preview accurately represents final appearance
✅ Admin can see all images clearly (no white screen bug)
✅ Mobile users see properly scaled cards
✅ Fast page loads (optimized image sizes)

---

## Notes for Implementation

### CSS Class Patterns

**For hero images**:
```tsx
className="object-cover object-center"
```

**For card images**:
```tsx
<div className="relative aspect-[3/2] overflow-hidden bg-zinc-100">
  <Image ... className="object-cover object-center" />
</div>
```

**For portraits (team/customers)**:
```tsx
<div className="relative aspect-square overflow-hidden bg-zinc-100">
  <img ... className="object-cover object-top" />
</div>
```

**For admin widescreen cards**:
```tsx
<div className="relative aspect-[16/9] overflow-hidden bg-zinc-100">
  <img ... className="object-cover object-center" />
</div>
```


### Common Pitfalls to Avoid

1. **Don't forget `relative` on parent** when using Next.js `Image` with `fill`
2. **Don't use `object-contain` for user photos** (leaves empty space, looks unprofessional)
3. **Don't use fixed heights** (`h-48`, `h-[340px]`) — use aspect ratios instead
4. **Don't forget `overflow-hidden`** on containers (prevents content bleed)
5. **Don't use `100vw` for `sizes`** when image is smaller (wastes bandwidth)

### Debugging Tips

**If image looks cropped**:
- Check `object-position` is set (default is `center` but explicit is better)
- Verify parent has correct aspect ratio
- Check `overflow-hidden` is on parent

**If background shows through**:
- Ensure container has `bg-zinc-100` or similar
- Verify image is using `object-cover` not `object-contain`

**If card heights vary**:
- Check all cards use `aspect-[X/Y]` not fixed heights
- Verify no extra padding/margin on children
- Use browser DevTools to inspect computed heights

---

## Post-Implementation

### Update Documentation
- [ ] Update `IMAGE_SIZES.md` with new aspect ratios
- [ ] Document the object-position standards
- [ ] Add examples of proper image container patterns


### Consider for Future
- [ ] Implement image focal point selection in admin (let users choose crop center)
- [ ] Add image dimension validation on upload (recommend optimal sizes)
- [ ] Create image optimization guidelines for content managers
- [ ] Add loading skeletons during image load (better perceived performance)
- [ ] Implement lazy loading for below-fold images (performance)

---

## Appendix: Before/After Examples

### Hero Section
**Before**: `className="object-cover"`
**After**: `className="object-cover object-center"`
**Impact**: Image centered at all viewports, no left-side crop

### ShowcaseCard
**Before**: Fixed `h-[340px]` + no object-position
**After**: `aspect-[3/2]` + `object-center`
**Impact**: Uniform card heights, responsive scaling, centered images

### Admin Services Card
**Before**: `aspect-square` + `object-contain` + `bg-zinc-50`
**After**: `aspect-[16/9]` + `object-cover object-center` + `bg-zinc-100`
**Impact**: Images always visible, better showcase format

### Career Page career3
**Before**: `objectFit: "fill"` (stretches/distorts)
**After**: `object-cover object-center` (fills container, maintains aspect)
**Impact**: No more distortion, professional appearance

---

**Plan Status**: ✅ Ready for Implementation
**Last Updated**: [Current Date]
**Version**: 1.0
