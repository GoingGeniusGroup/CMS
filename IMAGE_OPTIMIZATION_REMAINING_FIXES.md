# Image Optimization - Remaining Fixes

> **Status**: 2 small fixes needed to reach 100% completion
> **Time Required**: ~5 minutes total
> **Difficulty**: Very Easy

---

## Fix #1: HomeClient Hero Image (CRITICAL)

**Priority**: 🔴 High - Landing page hero
**Time**: 3 minutes
**File**: `app/(user)/home/HomeClient.tsx`
**Line**: ~107

### Problem
Hero image uses `object-contain` which causes letterboxing (empty space around image). Hero images should fill the container completely.

### Current Code
```tsx
<Image
  src={images.picture1}
  alt="Developer building a digital product"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-contain"  // ❌ Wrong - causes letterboxing
  priority
/>
```

### Fix
```diff
  <Image
    src={images.picture1}
    alt="Developer building a digital product"
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
-   className="object-contain"
+   className="object-cover object-center"
    priority
  />
```

### Test
- Visit landing page (`/`)
- Hero image should fill the entire container
- No empty space around edges
- Image centered at all viewport widths

---

## Fix #2: Projects Grid object-center

**Priority**: 🟡 Medium - Visual polish
**Time**: 2 minutes
**File**: `app/(user)/our-projects/ProjectsGrid.tsx`
**Line**: ~35

### Problem
Missing explicit `object-center` positioning. Images may crop unpredictably on certain aspect ratios.

### Current Code
```tsx
<Image
  src={project.thumbnail}
  alt={project.title}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
  className="object-cover transition-transform group-hover:scale-105"  // ❌ Missing object-center
/>
```

### Fix
```diff
  <Image
    src={project.thumbnail}
    alt={project.title}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
-   className="object-cover transition-transform group-hover:scale-105"
+   className="object-cover object-center transition-transform group-hover:scale-105"
  />
```

### Test
- Visit `/our-projects` page
- Scroll to projects grid section
- All project card images should be centered
- Hover should still trigger scale animation

---

## Quick Copy-Paste Commands

### Fix #1 - sed command (Linux/Mac)
```bash
cd /home/stranger/Documents/cms

sed -i 's/className="object-contain"/className="object-cover object-center"/g' app/(user)/home/HomeClient.tsx
```

### Fix #2 - sed command (Linux/Mac)
```bash
cd /home/stranger/Documents/cms

sed -i 's/className="object-cover transition-transform group-hover:scale-105"/className="object-cover object-center transition-transform group-hover:scale-105"/g' app/(user)/our-projects/ProjectsGrid.tsx
```

---

## After Applying Fixes

### Run Tests
1. Start dev server: `npm run dev`
2. Visit `/` - Check landing hero fills container
3. Visit `/our-projects` - Check projects grid images centered

### Mark Complete
Once verified, you can update the status:
- ✅ Phase 1: Hero Image Fixes - 100% complete
- ✅ Phase 4: Client Projects Grid - 100% complete
- ✅ Overall Plan: 100% complete

---

## Final Verification Checklist

After applying both fixes:

- [ ] Landing page hero fills container completely (no letterboxing)
- [ ] Landing page hero image centered at mobile width (375px)
- [ ] Landing page hero image centered at tablet width (768px)
- [ ] Landing page hero image centered at desktop width (1440px)
- [ ] /our-projects grid: all cards same height
- [ ] /our-projects grid: all images centered
- [ ] /our-projects grid: hover animation still works

**Once these pass, image optimization is 100% complete! 🎉**
