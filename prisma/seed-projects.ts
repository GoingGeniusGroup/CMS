import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

const projects = [
  {
    title: "Secure Mobile Banking App",
    slug: "secure-mobile-banking-app",
    description: "A next-generation mobile banking solution designed to make banking effortless, secure and accessible anytime, anywhere.",
    overview: "The Mobile Banking App is a secure and feature-rich mobile application that allows users to manage their finances seamlessly. It offers a wide range of banking features including fund transfers, bill payments, account management, card management, and more – all in one place.",
    status: "Published",
    category: "Mobile App Development",
    liveUrl: "https://example.com/banking-app",
    budget: 850000,
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-06-20"),
    thumbnail: "/Container-3.png",
    gallery: ["/Container-3.png", "/Container-1.png", "/Container-2.png", "/ProjectHero.png"],
    features: [
      { icon: "Shield", title: "Secure", description: "Bank-level security with 2FA & encryption" },
      { icon: "Zap", title: "Fast", description: "Instant transactions and real-time alerts" },
      { icon: "Users", title: "User-Friendly", description: "Clean interface for seamless experience" },
      { icon: "Server", title: "Reliable", description: "99.99% uptime with robust infrastructure" },
    ],
    highlights: [
      "Modern and intuitive UI/UX design",
      "Secure authentication with biometrics & 2FA",
      "Real-time balance updates and notifications",
      "Seamless fund transfer and bill payments",
      "Card management and transaction history",
      "Multi-language and dark mode support",
    ],
    challenges: [
      "Ensuring top-notch security for sensitive financial data",
      "Real-time balance updates across multiple bank integrations",
      "Seamless fund transfers with instant confirmation",
      "Support for multiple banks, cards and payment methods",
      "Scalability for millions of concurrent users",
    ],
    solutions: [
      "Secure login with biometrics & 2FA",
      "Real-time transaction processing via WebSockets",
      "Intuitive UI for all user demographics",
      "Multi-bank API integration layer",
      "Instant push notifications & alerts",
      "Scalable microservices architecture on AWS",
    ],
    technologies: ["React Native", "Node.js", "PostgreSQL", "Redis", "AWS", "Firebase"],
    results: [
      { icon: "Download", value: "120K+", label: "DOWNLOADS" },
      { icon: "SmilePlus", value: "95%", label: "CUSTOMER SATISFACTION" },
      { icon: "TrendingUp", value: "60%", label: "INCREASE IN DIGITAL TRANSACTIONS" },
      { icon: "Building2", value: "40%", label: "REDUCTION IN BRANCH VISITS" },
    ],
  },
  {
    title: "E-Commerce Platform",
    slug: "e-commerce-platform",
    description: "A scalable online shopping platform with secure payments, inventory management, responsive design, and an intuitive customer experience.",
    overview: "Built a complete e-commerce ecosystem from the ground up — including a customer-facing storefront, seller dashboard, admin panel, and logistics integration. The platform handles 10K+ concurrent users with sub-second page loads.",
    status: "Published",
    category: "Web Development",
    liveUrl: "https://example.com/ecommerce",
    budget: 1200000,
    startDate: new Date("2023-09-01"),
    endDate: new Date("2024-03-15"),
    thumbnail: "/Container-1.png",
    gallery: ["/Container-1.png", "/Container-2.png", "/Container-3.png", "/ProjectHero.png"],
    features: [
      { icon: "ShoppingCart", title: "Smart Cart", description: "AI-powered recommendations and dynamic pricing" },
      { icon: "CreditCard", title: "Multi-Payment", description: "Support for cards, wallets, UPI and COD" },
      { icon: "Truck", title: "Logistics", description: "Real-time order tracking and delivery estimates" },
      { icon: "BarChart3", title: "Analytics", description: "Comprehensive sales and user behavior insights" },
    ],
    highlights: [
      "Server-side rendered storefront for SEO",
      "Real-time inventory sync across warehouses",
      "Multi-vendor marketplace support",
      "Integrated payment gateway with fraud detection",
      "Automated email and push notification campaigns",
      "Progressive Web App for mobile users",
    ],
    challenges: [
      "Handling flash sale traffic spikes of 50K+ users",
      "Real-time inventory synchronization across multiple warehouses",
      "Complex multi-vendor commission and payout system",
      "Ensuring PCI DSS compliance for payment processing",
      "Optimizing page load speed for high conversion rates",
    ],
    solutions: [
      "Auto-scaling infrastructure with CDN edge caching",
      "Event-driven architecture with message queues",
      "Automated payout system with configurable commission rules",
      "Tokenized payments with third-party vault integration",
      "Image optimization pipeline and lazy loading",
      "Redis caching layer for product catalog",
    ],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "Stripe", "Docker"],
    results: [
      { icon: "Users", value: "50K+", label: "ACTIVE USERS" },
      { icon: "TrendingUp", value: "180%", label: "REVENUE GROWTH" },
      { icon: "Clock", value: "1.2s", label: "AVG PAGE LOAD" },
      { icon: "SmilePlus", value: "4.8/5", label: "USER RATING" },
    ],
  },
  {
    title: "Business Analytics Dashboard",
    slug: "business-analytics-dashboard",
    description: "A modern analytics dashboard providing real-time insights, interactive charts, and AI-powered predictions for enterprise decision-making.",
    overview: "Designed and developed a comprehensive business intelligence platform that consolidates data from 15+ sources into a unified dashboard. Features include real-time KPI tracking, custom report builder, predictive analytics, and role-based access control.",
    status: "Published",
    category: "SaaS Development",
    liveUrl: "https://example.com/dashboard",
    budget: 600000,
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-07-30"),
    thumbnail: "/Container-2.png",
    gallery: ["/Container-2.png", "/Container-1.png", "/ProjectHero.png", "/Container-3.png"],
    features: [
      { icon: "BarChart3", title: "Real-time", description: "Live data updates with WebSocket connections" },
      { icon: "Brain", title: "AI Insights", description: "ML-powered predictions and anomaly detection" },
      { icon: "Lock", title: "Secure", description: "Role-based access with SSO integration" },
      { icon: "Puzzle", title: "Integrations", description: "Connect 15+ data sources effortlessly" },
    ],
    highlights: [
      "Real-time data visualization with D3.js",
      "Custom drag-and-drop report builder",
      "AI-powered anomaly detection alerts",
      "White-label solution for enterprise clients",
      "Export to PDF, Excel, and scheduled email reports",
      "Mobile-responsive with offline data caching",
    ],
    challenges: [
      "Processing and visualizing millions of data points in real-time",
      "Building a flexible report builder for non-technical users",
      "Integrating with legacy enterprise systems via custom connectors",
      "Maintaining data accuracy across distributed data sources",
      "Meeting strict enterprise security and compliance requirements",
    ],
    solutions: [
      "Stream processing pipeline with Apache Kafka",
      "Intuitive drag-and-drop UI with visual query builder",
      "Custom ETL connectors with error retry logic",
      "Data validation layer with automated reconciliation",
      "SOC 2 compliant infrastructure with audit logging",
      "End-to-end encryption for data at rest and in transit",
    ],
    technologies: ["React", "Python", "Apache Kafka", "TimescaleDB", "TensorFlow", "Kubernetes"],
    results: [
      { icon: "Clock", value: "70%", label: "FASTER REPORTING" },
      { icon: "TrendingUp", value: "35%", label: "BETTER DECISION ACCURACY" },
      { icon: "Users", value: "200+", label: "ENTERPRISE USERS" },
      { icon: "Zap", value: "<500ms", label: "QUERY RESPONSE TIME" },
    ],
  },
];

async function main() {
  console.log("Seeding projects...");

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
    console.log(`  ✓ ${project.title}`);
  }

  console.log("Done seeding projects!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
