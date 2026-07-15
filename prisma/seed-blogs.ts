import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

function makeContent(sections: { heading: string; body: string }[]) {
  const nodes: object[] = [];
  for (const s of sections) {
    nodes.push({ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: s.heading }] });
    nodes.push({ type: "paragraph", content: [{ type: "text", text: s.body }] });
  }
  return { type: "doc", content: nodes };
}

const blogs = [
  {
    title: "How Artificial Intelligence is Transforming Modern Businesses",
    slug: "ai-transforming-modern-businesses",
    excerpt: "AI is no longer a futuristic concept — it is the present reality reshaping industries, improving efficiency, and creating new opportunities for businesses of all sizes.",
    status: "Published",
    category: "AI & Innovation",
    tags: ["Artificial Intelligence", "Machine Learning", "Business", "Automation", "Technology"],
    readTime: "10 min read",
    thumbnail: "/picture1.png",
    publishedAt: new Date("2026-06-22"),
    content: makeContent([
      { heading: "The Rise of AI in Business", body: "AI technologies are rapidly evolving and becoming more accessible. From machine learning algorithms to natural language processing, businesses are leveraging AI to automate tasks, gain insights, and enhance customer experiences. Companies that adopt AI early are seeing significant competitive advantages in their respective markets." },
      { heading: "Key Benefits of AI", body: "Businesses adopting AI are experiencing significant advantages across multiple areas including increased efficiency through task automation, data-driven insights for smarter decision-making, better customer experiences through personalization, and substantial cost reduction by optimizing operations." },
      { heading: "Real-World Applications", body: "AI is being used in healthcare for diagnostics and drug discovery, in finance for fraud detection and algorithmic trading, in retail for personalized recommendations and inventory optimization, and in manufacturing for predictive maintenance and quality control." },
      { heading: "The Future of AI", body: "The future of AI is promising. As technology continues to advance, we can expect even more intelligent systems that can understand, learn, and adapt to our needs. Businesses that embrace AI today will be the leaders of tomorrow. The integration of AI with IoT, blockchain, and quantum computing will unlock unprecedented possibilities." },
    ]),
  },
  {
    title: "10 Best Practices for Clean & Maintainable Code",
    slug: "best-practices-clean-code",
    excerpt: "Learn how to write code that scales and is easy for other developers to understand, maintain, and extend over time.",
    status: "Published",
    category: "Web Development",
    tags: ["Clean Code", "Best Practices", "Programming", "Software Engineering", "Code Quality"],
    readTime: "8 min read",
    thumbnail: "/blog2.png",
    publishedAt: new Date("2026-06-18"),
    content: makeContent([
      { heading: "Why Clean Code Matters", body: "Clean code is not just about aesthetics — it directly impacts maintainability, bug reduction, and team productivity. Code is read far more often than it is written, so investing in readability pays dividends throughout the project lifecycle." },
      { heading: "Meaningful Naming Conventions", body: "Use descriptive, intention-revealing names for variables, functions, and classes. Avoid abbreviations and single-letter names except in small loops. Your code should read like well-written prose that any developer can understand without extensive comments." },
      { heading: "Keep Functions Small and Focused", body: "Each function should do one thing and do it well. If a function exceeds 20 lines, consider breaking it into smaller, well-named helper functions. This makes testing easier and reduces cognitive load when reading the code." },
      { heading: "Write Tests First", body: "Test-driven development (TDD) ensures your code works as expected and provides a safety net for refactoring. Well-written tests serve as living documentation and give confidence when making changes to existing code." },
    ]),
  },
  {
    title: "The Complete Guide to Modern UI/UX Design in 2026",
    slug: "guide-modern-ui-ux-design-2026",
    excerpt: "Discover the latest design trends, tools, and methodologies that are shaping user experiences in 2026 and beyond.",
    status: "Published",
    category: "Design & UX",
    tags: ["UI/UX", "Design", "User Experience", "Figma", "Accessibility", "Design Systems"],
    readTime: "12 min read",
    thumbnail: "/blog1.png",
    publishedAt: new Date("2026-06-10"),
    content: makeContent([
      { heading: "Design Trends Shaping 2026", body: "From glassmorphism to AI-generated interfaces, the design landscape is evolving rapidly. Spatial design for AR/VR, micro-interactions, and hyper-personalization are becoming standard expectations rather than differentiators." },
      { heading: "Accessibility-First Design", body: "Inclusive design is no longer optional. With WCAG 3.0 guidelines emerging, designers must consider users with disabilities from the very beginning. Color contrast, keyboard navigation, screen reader support, and cognitive load reduction are fundamental requirements." },
      { heading: "Design Systems at Scale", body: "Design systems have become the backbone of consistent product experiences. Tools like Figma with its variable system, component variants, and auto-layout make it possible to maintain consistency across products with hundreds of screens and multiple teams." },
      { heading: "The Rise of AI in Design", body: "AI tools are augmenting designers, not replacing them. From auto-generating layouts to writing microcopy, AI speeds up the repetitive parts of design work while freeing designers to focus on strategy, research, and creative problem-solving." },
    ]),
  },
  {
    title: "Building Scalable Cloud Architecture: A Practical Approach",
    slug: "building-scalable-cloud-architecture",
    excerpt: "A hands-on guide to designing cloud infrastructure that grows with your business without breaking the bank.",
    status: "Published",
    category: "Cloud & DevOps",
    tags: ["Cloud", "AWS", "Architecture", "DevOps", "Scalability", "Kubernetes"],
    readTime: "15 min read",
    thumbnail: "/Container-2.png",
    publishedAt: new Date("2026-05-28"),
    content: makeContent([
      { heading: "Why Cloud Architecture Matters", body: "Poor architecture decisions made early can cost millions to fix later. A well-designed cloud architecture handles traffic spikes gracefully, keeps costs predictable, and enables rapid feature delivery without compromising reliability or security." },
      { heading: "Microservices vs Monolith", body: "Not every application needs microservices. Start with a modular monolith and extract services only when you have clear boundaries and team ownership. Premature decomposition adds complexity without proportional benefits for small to medium applications." },
      { heading: "Auto-Scaling Strategies", body: "Implement horizontal scaling with container orchestration (Kubernetes or ECS), use predictive scaling based on traffic patterns, and leverage serverless for bursty workloads. Combine this with CDN caching and database read replicas for a resilient architecture." },
      { heading: "Cost Optimization", body: "Use reserved instances for baseline load, spot instances for batch processing, and implement automated resource scheduling. Set up cost alerts, tag resources by team, and regularly review usage patterns to eliminate waste." },
    ]),
  },
];

async function main() {
  console.log("Seeding blogs...");

  for (const blog of blogs) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: blog,
      create: blog,
    });
    console.log(`  ✓ ${blog.title}`);
  }

  console.log("Done seeding blogs!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
