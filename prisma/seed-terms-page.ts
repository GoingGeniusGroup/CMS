import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

// Helper builders for Tiptap JSON
const h2 = (text: string) => ({
  type: "heading",
  attrs: { level: 2 },
  content: [{ type: "text", text }],
});
const p = (text: string) => ({
  type: "paragraph",
  content: [{ type: "text", text }],
});
const bullets = (items: string[]) => ({
  type: "bulletList",
  content: items.map((t) => ({
    type: "listItem",
    content: [p(t)],
  })),
});

const content = {
  type: "doc",
  content: [
    p(
      "Please read these terms and conditions carefully before using our website and services."
    ),
    h2("Introduction"),
    p(
      "Welcome to Going Genius. By accessing or using our website and services, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our website. These terms govern your relationship with Going Genius, a leading provider of digital transformation solutions."
    ),
    h2("Use of Website"),
    p(
      "You may use our website only for lawful purposes and in accordance with these Terms. You agree not to:"
    ),
    bullets([
      "Attempt to gain unauthorized access to any part of the site.",
      "Use the website in a way that could damage, disable or impair it.",
      "Reproduce or exploit any content for commercial use without permission.",
    ]),
    h2("Services"),
    p(
      "We provide digital services including web development, mobile app development, UI/UX design, digital marketing, and other related services. The specific details of each service will be provided during our engagement through individual service level agreements or statements of work."
    ),
    h2("Intellectual Property"),
    p(
      "All content, logos, text, graphics, and materials on this website are the property of Going Genius. You may not copy, reproduce or distribute any content without our written permission. All proprietary software and methodologies remain the exclusive property of Going Genius unless explicitly stated otherwise in a separate signed contract."
    ),
    h2("User Responsibilities"),
    p(
      "You are responsible for maintaining the confidentiality of any information you provide through our forms or emails. You agree not to submit any false, misleading or illegal information. Users are expected to maintain professional conduct during all communication with our team members."
    ),
    h2("Limitation of Liability"),
    p(
      "Going Genius is not liable for any indirect, incidental or consequential damages resulting from the use of our website or services. While we strive for accuracy, we do not guarantee that all information provided is complete or error free."
    ),
    h2("Privacy Policy"),
    p(
      "Our Privacy Policy explains how we collect, use and protect your data. By using our services, you agree to our Privacy Policy. We are committed to protecting your personal information and ensuring your data is handled with the highest security standards."
    ),
    h2("Termination"),
    p(
      "We reserve the right to terminate or suspend access if you violate these Terms & Conditions or engage in any unlawful activity. Termination of access may occur without prior notice in cases of a security or site terms breach."
    ),
    h2("Changes to Terms"),
    p(
      "We may update these Terms & Conditions from time to time. Changes will be posted on this page with the updated date. Continued use of the website after changes constitutes acceptance of the new terms."
    ),
    h2("Governing Law"),
    p(
      "These Terms & Conditions shall be governed by the laws of the jurisdiction in which Going Genius operates, specifically following the legal frameworks of Nepal. Any disputes will be settled in the appropriate courts of Nepal."
    ),
    h2("Contact Us"),
    p("If you have any questions about these Terms & Conditions, please contact us:"),
    bullets([
      "Email: goinggenius2021@gmail.com",
      "Location: Kathmandu, Nepal",
    ]),
  ],
};

async function main() {
  console.log("Seeding Terms & Conditions page...");

  const slug = "terms-and-conditions";
  const existing = await prisma.page.findUnique({ where: { slug } });

  const data = {
    title: "Terms & Conditions",
    slug,
    content: content as object,
    status: "Published",
    metaTitle: "Terms & Conditions | Going Genius",
    metaDesc:
      "Read the terms and conditions for using Going Genius website and services.",
    keywords: "terms, conditions, legal, going genius",
  };

  if (existing) {
    await prisma.page.update({ where: { slug }, data });
    console.log("  ✓ Updated existing Terms & Conditions page");
  } else {
    await prisma.page.create({ data });
    console.log("  ✓ Created Terms & Conditions page");
  }

  // Add to navigation menu if not present
  const header = await prisma.websiteHeader.findFirst();
  if (header) {
    const menuItems = (header.menuItems as { label: string; path: string }[]) ?? [];
    if (!menuItems.some((m) => m.path === `/${slug}`)) {
      menuItems.push({ label: "Terms & Conditions", path: `/${slug}` });
      await prisma.websiteHeader.update({
        where: { id: header.id },
        data: { menuItems },
      });
      console.log("  ✓ Added Terms & Conditions to navigation menu");
    }
  }

  console.log("Done! Visit /terms-and-conditions");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
