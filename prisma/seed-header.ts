import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding website header...");

  const menuItems = [
    { label: "Home", path: "/home" },
    { label: "Services", path: "/our-services" },
    {
      label: "Work",
      path: "/our-projects",
      children: [
        { label: "Projects", path: "/our-projects" },
        { label: "Blogs", path: "/blogs" },
      ],
    },
    {
      label: "Company",
      path: "/company",
      children: [
        { label: "About Us", path: "/about-us" },
        { label: "Our Company", path: "/company" },
        { label: "Our Team", path: "/teams" },
        { label: "Careers", path: "/career" },
      ],
    },
    {
      label: "Legal",
      path: "/terms-and-conditions",
      children: [
        { label: "Terms & Conditions", path: "/terms-and-conditions" },
      ],
    },
    { label: "Contact", path: "/contact" },
  ];

  const existing = await prisma.websiteHeader.findFirst();

  if (existing) {
    await prisma.websiteHeader.update({
      where: { id: existing.id },
      data: {
        stickyHeader: true,
        bannerImageUrl: "",
        bannerLink: "",
        helpNumber: "+977-9768527869",
        menuItems,
      },
    });
    console.log("  ✓ Updated existing website header");
  } else {
    await prisma.websiteHeader.create({
      data: {
        stickyHeader: true,
        bannerImageUrl: "",
        bannerLink: "",
        helpNumber: "+977-9768527869",
        menuItems,
      },
    });
    console.log("  ✓ Created website header");
  }

  console.log("  Menu items seeded:");
  menuItems.forEach((m) => {
    console.log(`    - ${m.label} → ${m.path}`);
    m.children?.forEach((c) => console.log(`        ↳ ${c.label} → ${c.path}`));
  });
  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
