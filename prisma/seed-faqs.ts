import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

const faqs = [
  { question: "What services does Going Genius offer?", answer: "Going Genius provides a wide range of services including web development, mobile app development, UI/UX design, digital marketing, cloud solutions, and IT consulting. We tailor each service to meet the unique needs of our clients.", category: "Services" },
  { question: "How long does it take to complete a project?", answer: "Project timelines vary depending on the scope and complexity. A typical website can take 4–8 weeks, while larger applications may take 3–6 months. We provide a detailed timeline during the initial consultation.", category: "Services" },
  { question: "What is the cost of your services?", answer: "Our pricing is project-based and depends on the requirements. We offer competitive rates and provide a free consultation to discuss your needs and provide a detailed quote. Contact us to get started.", category: "Pricing" },
  { question: "Do you offer ongoing support after project completion?", answer: "Yes, we offer comprehensive post-launch support and maintenance packages. This includes bug fixes, updates, performance monitoring, and feature enhancements as needed.", category: "Support" },
  { question: "What technologies do you use?", answer: "We work with modern technologies including React, Next.js, Node.js, Python, PostgreSQL, AWS, and many more. Our team stays up-to-date with the latest industry standards to deliver high-quality solutions.", category: "Services" },
  { question: "How do I get started with Going Genius?", answer: "Simply reach out through our contact form, email, or phone. We'll schedule a free consultation to discuss your project, goals, and budget. From there, we'll create a proposal tailored to your needs.", category: "General" },
  { question: "Can you work with our existing team?", answer: "Absolutely. We frequently collaborate with in-house teams, providing additional expertise and bandwidth. We can integrate seamlessly into your existing workflow and tools.", category: "General" },
  { question: "What industries do you serve?", answer: "We serve a diverse range of industries including healthcare, finance, education, e-commerce, real estate, and technology. Our adaptable approach ensures we meet the specific needs of each sector.", category: "General" },
  { question: "Do you offer custom software development?", answer: "Yes, custom software development is one of our core offerings. We build tailored solutions from the ground up, ensuring they align perfectly with your business processes and goals.", category: "Services" },
  { question: "What is your refund or revision policy?", answer: "We include multiple revision rounds in every project to ensure your satisfaction. Our policy is transparent and outlined in the project agreement before work begins. We aim to deliver exactly what you need.", category: "Pricing" },
];

async function main() {
  console.log("Seeding FAQs...");

  for (const faq of faqs) {
    await prisma.faq.create({ data: faq });
  }

  console.log(`  ✓ Seeded ${faqs.length} FAQs`);
  console.log("Done!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
