import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding footer settings...");

  const data = {
    footerLogoUrl: "",
    brandText: "Going Genius Group of Companies",
    aboutDesc: "Going Genius provides services that add value to your ideas. Connect with us today and transform your vision into reality.",
    copyrightText: `© ${new Date().getFullYear()} Going Genius Group of Company. All rights reserved.`,
    playStoreLink: "",
    appStoreLink: "",
    paymentLogos: [],
    socials: [
      { platform: "Facebook", url: "https://facebook.com/goinggenius" },
      { platform: "LinkedIn", url: "https://linkedin.com/company/goinggenius" },
      { platform: "Instagram", url: "https://instagram.com/goinggenius" },
      { platform: "Twitter", url: "https://twitter.com/goinggenius" },
      { platform: "YouTube", url: "https://youtube.com/@goinggenius" },
    ],
    linkColumns: [
      {
        title: "Platform",
        links: [
          { label: "Portals", href: "/home" },
          { label: "Relativity", href: "/our-services" },
          { label: "Software Development", href: "/our-services" },
          { label: "5G", href: "/our-services" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "User Guide", href: "#" },
          { label: "FAQs", href: "#faq" },
          { label: "Developers", href: "#" },
          { label: "Sitemap", href: "#" },
          { label: "Support", href: "/contact" },
        ],
      },
      {
        title: "About",
        links: [
          { label: "About Us", href: "/about-us" },
          { label: "Company", href: "/company" },
          { label: "Services", href: "/our-services" },
          { label: "Career", href: "/career" },
          { label: "Contact Us", href: "/contact" },
          { label: "Blog", href: "/blogs" },
        ],
      },
    ],
  };

  const existing = await prisma.footerSetting.findFirst();
  if (existing) {
    await prisma.footerSetting.update({ where: { id: existing.id }, data });
    console.log("  ✓ Updated existing footer settings");
  } else {
    await prisma.footerSetting.create({ data });
    console.log("  ✓ Created footer settings");
  }

  console.log("Done!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
