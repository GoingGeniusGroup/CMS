import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding jobs...");

  const jobs = [
    {
      title: "Senior Frontend Developer",
      department: "Developer",
      type: "Full-time",
      mode: "Remote",
      location: "Kathmandu / Remote",
      salaryRange: "$65,000 - $85,000 / yr",
      experience: "3-5 years",
      vacanciesCount: 2,
      deadline: new Date("2026-08-30"),
      isActive: true,
      isFeatured: true,
      tags: ["React", "TypeScript", "Tailwind", "Next.js"],
      description: "Help us build high-performance, accessible, and beautiful web interfaces for our enterprise core platform using modern tech stacks.",
      responsibilities: [
        "Develop responsive and accessible web applications using React & Next.js",
        "Collaborate with backend engineers to integrate GraphQL & REST APIs",
        "Lead web performance optimizations and code quality standards",
      ],
      requirements: [
        "3+ years experience with React, Next.js, and TypeScript",
        "In-depth mastery of CSS/Tailwind and modern frontend architectures",
      ],
    },
    {
      title: "Lead UI/UX Product Designer",
      department: "Design",
      type: "Full-time",
      mode: "Hybrid",
      location: "Kathmandu, Nepal",
      salaryRange: "$50,000 - $70,000 / yr",
      experience: "4+ years",
      vacanciesCount: 1,
      deadline: new Date("2026-08-20"),
      isActive: true,
      isFeatured: true,
      tags: ["Figma", "Design System", "User Research"],
      description: "Design intuitive digital product experiences, interactive wireframes, and design systems for enterprise software.",
      responsibilities: [
        "Create high-fidelity wireframes, interactive prototypes, and user flows",
        "Maintain and evolve our design system UI component libraries",
      ],
      requirements: [
        "4+ years experience in product design for web and mobile",
        "Expert knowledge of Figma, auto-layout, and prototyping",
      ],
    },
    {
      title: "Backend Software Engineer (Node/Go)",
      department: "Developer",
      type: "Full-time",
      mode: "Remote",
      location: "Remote",
      salaryRange: "$70,000 - $95,000 / yr",
      experience: "3+ years",
      vacanciesCount: 3,
      deadline: new Date("2026-09-10"),
      isActive: true,
      isFeatured: false,
      tags: ["Node.js", "PostgreSQL", "Go", "Prisma"],
      description: "Architect and build resilient backend microservices, real-time sync systems, and secure cloud API infrastructure.",
      responsibilities: [
        "Design database models and optimize SQL query performance",
        "Implement RESTful and GraphQL APIs using Node.js & Go",
      ],
      requirements: [
        "3+ years building production backend APIs and relational databases",
      ],
    },
    {
      title: "Digital Marketing & SEO Manager",
      department: "Marketing",
      type: "Full-time",
      mode: "On-site",
      location: "Kathmandu, Nepal",
      salaryRange: "$35,000 - $45,000 / yr",
      experience: "2-4 years",
      vacanciesCount: 1,
      deadline: new Date("2026-08-15"),
      isActive: true,
      isFeatured: false,
      tags: ["SEO", "Google Ads", "Content Strategy"],
      description: "Drive organic traffic growth, run targeted ad campaigns, and measure client acquisition metrics across digital channels.",
      responsibilities: [
        "Execute technical and content SEO strategies across web properties",
      ],
      requirements: [
        "2+ years experience in digital marketing and SEO growth",
      ],
    },
    {
      title: "DevOps & Cloud Systems Engineer",
      department: "Operations",
      type: "Contract",
      mode: "Remote",
      location: "Remote",
      salaryRange: "$80,000 - $110,000 / yr",
      experience: "4+ years",
      vacanciesCount: 1,
      deadline: new Date("2026-09-01"),
      isActive: false,
      isFeatured: false,
      tags: ["AWS", "Kubernetes", "Terraform"],
      description: "Manage AWS cloud infrastructure, automate deployment pipelines, and maintain system monitoring.",
      responsibilities: [
        "Manage cloud infrastructure using Terraform and Infrastructure-as-Code",
      ],
      requirements: [
        "4+ years experience with AWS, Kubernetes, and Terraform",
      ],
    },
  ];

  for (const job of jobs) {
    const existing = await prisma.job.findFirst({
      where: { title: job.title },
    });
    if (existing) {
      await prisma.job.update({ where: { id: existing.id }, data: job });
      console.log(`  ✓ Updated: ${job.title}`);
    } else {
      await prisma.job.create({ data: job });
      console.log(`  ✓ Created: ${job.title}`);
    }
  }

  console.log("Done!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
