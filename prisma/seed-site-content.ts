/**
 * Seeds the SiteContent table with the exact copy currently hardcoded in the
 * public landing components. Seeding is idempotent (upsert on [pageKey,
 * sectionKey]) and, by design, a visual no-op the first time it's run — every
 * default payload here matches what's rendered today, so admins only see a
 * change once they actively edit something in the Landing Page editor.
 *
 * Run with: npm run seed-site-content
 */
import { PrismaClient } from "../lib/generated/prisma";
import { SECTION_REGISTRY, type SectionKey } from "../lib/content/schemas";

const prisma = new PrismaClient();

async function seedSiteContent() {
  let created = 0;
  let skipped = 0;

  for (const [sectionKey, entry] of Object.entries(SECTION_REGISTRY) as [SectionKey, (typeof SECTION_REGISTRY)[SectionKey]][]) {
    const existing = await prisma.siteContent.findUnique({
      where: { pageKey_sectionKey: { pageKey: entry.pageKey, sectionKey } },
    });

    if (existing) {
      skipped += 1;
      continue;
    }

    await prisma.siteContent.create({
      data: {
        pageKey: entry.pageKey,
        sectionKey,
        variant: "default",
        isVisible: true,
        order: entry.defaultOrder,
        data: entry.defaultData,
      },
    });
    created += 1;
  }

  console.log(`  ✓ site_content seeded (${created} created, ${skipped} already existed)`);
}

async function main() {
  console.log("Seeding site content...");
  await seedSiteContent();
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
