import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function upsertFirst<T extends { findFirst: (...a: any[]) => any; create: (...a: any[]) => any; update: (...a: any[]) => any }>(
  model: T,
  data: Record<string, unknown>
) {
  const existing = await model.findFirst();
  if (existing) {
    await model.update({ where: { id: existing.id }, data });
  } else {
    await model.create({ data });
  }
}

async function main() {
  console.log("Seeding admin panel settings...\n");

  // ── General Settings ──────────────────────────────────────────────────
  await upsertFirst(prisma.generalSetting, {
    siteName: "Going Genius",
    description:
      "Going Genius provides services that add value to your ideas. Connect with us today and transform your vision into reality.",
    logoUrl: "/logo.png",
    faviconUrl: "/favicon.ico",
    metaKeywords: "going genius, web development, app development, digital agency, nepal",
    themeColor: "#fe9a00",
    themeTextColor: "#000000",
    baseColorEnabled: true,
  });
  console.log("  ✓ General settings");

  // ── Appearance Settings ───────────────────────────────────────────────
  await upsertFirst(prisma.appearanceSetting, {
    baseColor: "#fe9a00",
    hoverColor: "#e08800",
    hoverEnabled: true,
    timezone: "(GMT+05:45) Asia/Kathmandu",
  });
  console.log("  ✓ Appearance settings");

  // ── SEO Settings ───────────────────────────────────────────────────────
  await upsertFirst(prisma.seoSetting, {
    metaTitle: "Going Genius | Digital Transformation Partner",
    metaDescription:
      "Going Genius helps businesses grow through web development, mobile apps, UI/UX design and digital marketing services.",
    metaKeywords: "web development, mobile app development, ui ux design, digital marketing, nepal it company",
    metaImage: "/logo.png",
  });
  console.log("  ✓ SEO settings");

  // ── Contact Settings ──────────────────────────────────────────────────
  await upsertFirst(prisma.contactSetting, {
    phone1: "+977-9768527869",
    phone2: "+977-9801000000",
    email1: "goinggenius2021@gmail.com",
    email2: "support@goinggenius.com",
    address: "Milan Chowk Marga, Kathmandu 44600, Nepal",
    contactMail: "goinggenius2021@gmail.com",
    officeHours: "Sunday - Friday: 10:00 AM - 6:00 PM",
    googleMapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1766.98!2d85.3240!3d27.7172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18d%3A0x0!2sKathmandu!5e0!3m2!1sen!2snp",
  });
  console.log("  ✓ Contact settings");

  // ── Social Settings ───────────────────────────────────────────────────
  await upsertFirst(prisma.socialSetting, {
    facebook: "https://facebook.com/goinggenius",
    twitter: "https://twitter.com/goinggenius",
    instagram: "https://instagram.com/goinggenius",
    linkedin: "https://linkedin.com/company/goinggenius",
    pinterest: "",
    youtube: "https://youtube.com/@goinggenius",
    whatsapp: "https://wa.me/9779768527869",
  });
  console.log("  ✓ Social settings");

  // ── Cookie Settings ───────────────────────────────────────────────────
  await upsertFirst(prisma.cookieSetting, {
    cookiesAgreement: true,
    showCookiesAgreement: true,
    cookiesAgreementText:
      "We use cookies to improve your experience on our website. By continuing to browse, you agree to our use of cookies.",
  });
  console.log("  ✓ Cookie settings");

  // ── Popup Settings ────────────────────────────────────────────────────
  await upsertFirst(prisma.popupSetting, {
    showPopup: true,
    content:
      "Welcome to Going Genius! We're currently offering a free consultation for new projects. Get in touch with us today.",
  });
  console.log("  ✓ Popup settings");

  // ── Email Settings (placeholders — no real secrets) ──────────────────
  await upsertFirst(prisma.emailSetting, {
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "goinggenius2021@gmail.com",
    smtpPassword: "",
    fromName: "Going Genius",
    fromEmail: "goinggenius2021@gmail.com",
    encryption: "tls",
  });
  console.log("  ✓ Email settings (SMTP password left blank — set it manually)");

  // ── Security Settings ─────────────────────────────────────────────────
  await upsertFirst(prisma.securitySetting, {
    twoFactorEnabled: false,
    loginAttempts: 5,
    sessionTimeout: 30,
    passwordMinLength: 8,
  });
  console.log("  ✓ Security settings");

  // ── Partner logos (Setting key-value) ─────────────────────────────────
  await prisma.setting.upsert({
    where: { key: "partners-logos" },
    update: { value: { partners: ["/partner1.png", "/partner2.png", "/partner3.png"] } },
    create: { key: "partners-logos", value: { partners: ["/partner1.png", "/partner2.png", "/partner3.png"] } },
  });
  console.log("  ✓ Partner logos");

  // ── Technology logos (Setting key-value) ──────────────────────────────
  await prisma.setting.upsert({
    where: { key: "technologies-logos" },
    update: {
      value: {
        technologies: [
          "/tech-react.png",
          "/tech-nextjs.png",
          "/tech-node.png",
          "/tech-postgres.png",
        ],
      },
    },
    create: {
      key: "technologies-logos",
      value: {
        technologies: [
          "/tech-react.png",
          "/tech-nextjs.png",
          "/tech-node.png",
          "/tech-postgres.png",
        ],
      },
    },
  });
  console.log("  ✓ Technology logos");

  // ── Categories ─────────────────────────────────────────────────────────
  const categories = [
    { name: "Web Development", slug: "web-development", order: 1, status: "Active" },
    { name: "Mobile App Development", slug: "mobile-app-development", order: 2, status: "Active" },
    { name: "UI/UX Design", slug: "ui-ux-design", order: 3, status: "Active" },
    { name: "Digital Marketing", slug: "digital-marketing", order: 4, status: "Active" },
    { name: "Cloud & DevOps", slug: "cloud-devops", order: 5, status: "Active" },
  ];
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`  ✓ Categories (${categories.length})`);

  // ── Services ───────────────────────────────────────────────────────────
  const services = [
    {
      serviceName: "Web Development",
      description: "Custom, scalable websites and web applications built with modern frameworks.",
      category: "Development",
      basePrice: 50000,
      isActive: true,
      isFeatured: true,
      thumbnailUrl: "/web.png",
    },
    {
      serviceName: "Mobile App Development",
      description: "Native and cross-platform mobile apps for iOS and Android.",
      category: "Development",
      basePrice: 80000,
      isActive: true,
      isFeatured: true,
      thumbnailUrl: "/webdev.png",
    },
    {
      serviceName: "UI/UX Design",
      description: "User-centered design that turns ideas into intuitive, beautiful interfaces.",
      category: "Design",
      basePrice: 30000,
      isActive: true,
      isFeatured: false,
      thumbnailUrl: "/picture1.png",
    },
    {
      serviceName: "Digital Marketing",
      description: "SEO, social media, and content marketing strategies that drive growth.",
      category: "Marketing",
      basePrice: 25000,
      isActive: true,
      isFeatured: false,
      thumbnailUrl: "/blog1.png",
    },
    {
      serviceName: "Cloud & DevOps",
      description: "Scalable cloud infrastructure, CI/CD pipelines, and DevOps automation.",
      category: "Infrastructure",
      basePrice: 40000,
      isActive: true,
      isFeatured: false,
      thumbnailUrl: "/Container-2.png",
    },
  ];
  const serviceIds: Record<string, string> = {};
  for (const svc of services) {
    const existing = await prisma.service.findFirst({ where: { serviceName: svc.serviceName } });
    if (existing) {
      await prisma.service.update({ where: { id: existing.id }, data: svc });
      serviceIds[svc.serviceName] = existing.id;
    } else {
      const created = await prisma.service.create({ data: svc });
      serviceIds[svc.serviceName] = created.id;
    }
  }
  console.log(`  ✓ Services (${services.length})`);

  // ── Customers ────────────────────────────────────────────────────────
  const customers = [
    {
      fullName: "Ram Sharma",
      email: "ram@example.com",
      phoneNumber: "+977-9801111111",
      address: "Baneshwor, Kathmandu",
      companyName: "Sharma Traders",
      status: "Active",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=ram",
      serviceId: serviceIds["Web Development"],
    },
    {
      fullName: "Sita Gurung",
      email: "sita@example.com",
      phoneNumber: "+977-9802222222",
      address: "Lakeside, Pokhara",
      companyName: "Gurung Enterprises",
      status: "Active",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sita",
      serviceId: serviceIds["Mobile App Development"],
    },
    {
      fullName: "Hari Thapa",
      email: "hari@example.com",
      phoneNumber: "+977-9803333333",
      address: "New Road, Kathmandu",
      companyName: "Thapa Retail",
      status: "Inactive",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=hari",
      serviceId: serviceIds["Digital Marketing"],
    },
  ];
  for (const c of customers) {
    await prisma.customer.upsert({
      where: { email: c.email },
      update: c,
      create: c,
    });
  }
  console.log(`  ✓ Customers (${customers.length})`);

  console.log("\nDone seeding all admin panel settings!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
