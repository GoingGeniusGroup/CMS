import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

const teamMembers = [
  // Leadership
  {
    fullName: "Bibek Lama",
    email: "bibek@goinggenius.com",
    role: "CEO & Founder",
    department: "Leadership",
    phone: "+977 9801000001",
    status: "Active",
    location: "Kathmandu, Nepal",
    experience: "8+ Years",
    bio: "Bibek is the visionary founder and CEO of Going Genius Group. With over 8 years of experience in the tech industry, he leads the company's strategic direction and ensures every project delivers exceptional value to clients.",
    skills: ["Leadership", "Business Strategy", "Product Management", "Team Building", "Client Relations"],
    image: "/Alex.png",
    facebook: "https://facebook.com/bibeklama",
    twitter: "https://twitter.com/bibeklama",
    instagram: "https://instagram.com/bibeklama",
    linkedin: "https://linkedin.com/in/bibeklama",
    website: "https://goinggenius.com",
  },
  // Development Team
  {
    fullName: "Arjun Gautam",
    email: "arjun@goinggenius.com",
    role: "Full Stack Developer",
    department: "Development",
    phone: "+977 9801000002",
    status: "Active",
    location: "Kathmandu, Nepal",
    experience: "5+ Years",
    bio: "Arjun is a passionate full stack developer who builds scalable web applications using modern technologies. He specializes in React, Next.js, Node.js, and cloud architecture.",
    skills: ["React.js", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    image: "/Alex.png",
    facebook: "https://facebook.com/arjungautam",
    twitter: "https://twitter.com/arjungautam",
    instagram: "https://instagram.com/arjungautam",
    linkedin: "https://linkedin.com/in/arjungautam",
    website: "https://arjungautam.dev",
  },
  {
    fullName: "Prakash Sapkota",
    email: "prakash@goinggenius.com",
    role: "Full Stack Developer",
    department: "Development",
    phone: "+977 9801000003",
    status: "Active",
    location: "Kathmandu, Nepal",
    experience: "4+ Years",
    bio: "Prakash is a skilled full stack developer with expertise in building robust backend systems and responsive frontend interfaces. He loves solving complex problems with clean, maintainable code.",
    skills: ["React.js", "Node.js", "Python", "MongoDB", "Docker", "REST APIs"],
    image: "/Alex.png",
  },
  {
    fullName: "Rohit Baral",
    email: "rohit@goinggenius.com",
    role: "Full Stack Developer",
    department: "Development",
    phone: "+977 9801000004",
    status: "Active",
    location: "Kathmandu, Nepal",
    experience: "3+ Years",
    bio: "Rohit is a dedicated full stack developer who excels at building performant web applications. He has a keen eye for detail and is always eager to learn emerging technologies.",
    skills: ["JavaScript", "TypeScript", "React.js", "Express.js", "PostgreSQL", "Tailwind CSS"],
    image: "/Alex.png",
  },
  {
    fullName: "Subarna",
    email: "subarna@goinggenius.com",
    role: "Full Stack Developer",
    department: "Development",
    phone: "+977 9801000005",
    status: "Active",
    location: "Kathmandu, Nepal",
    experience: "3+ Years",
    bio: "Subarna is a versatile full stack developer who brings creativity and technical precision to every project. He contributes across the entire stack from database design to pixel-perfect UIs.",
    skills: ["Next.js", "React.js", "Node.js", "Prisma", "Tailwind CSS", "Git"],
    image: "/Alex.png",
  },
  {
    fullName: "Jyoti Kunwar",
    email: "jyoti@goinggenius.com",
    role: "Full Stack Developer",
    department: "Development",
    phone: "+977 9801000006",
    status: "Active",
    location: "Kathmandu, Nepal",
    experience: "3+ Years",
    bio: "Jyoti is a talented full stack developer who builds reliable, user-friendly applications. She combines strong frontend skills with solid backend knowledge to deliver complete solutions.",
    skills: ["React.js", "Next.js", "Node.js", "TypeScript", "CSS/SCSS", "Firebase"],
    image: "/girl.png",
  },
  {
    fullName: "Sima Malla",
    email: "sima@goinggenius.com",
    role: "Full Stack Developer",
    department: "Development",
    phone: "+977 9801000007",
    status: "Active",
    location: "Kathmandu, Nepal",
    experience: "2+ Years",
    bio: "Sima is a motivated full stack developer with a passion for building modern web applications. She constantly pushes herself to improve and deliver high-quality work.",
    skills: ["JavaScript", "React.js", "Node.js", "MongoDB", "HTML/CSS", "Git"],
    image: "/girl.png",
  },
  {
    fullName: "Ambika Khatiwada",
    email: "ambika@goinggenius.com",
    role: "UI/UX Designer",
    department: "Design",
    phone: "+977 9801000008",
    status: "Active",
    location: "Kathmandu, Nepal",
    experience: "4+ Years",
    bio: "Ambika is a creative UI/UX designer who crafts intuitive and visually stunning interfaces. She combines user research with modern design principles to create experiences that delight users.",
    skills: ["Figma", "Adobe XD", "UI Design", "UX Research", "Prototyping", "Design Systems"],
    image: "/girl.png",
  },
  {
    fullName: "Anisha Khatiwada",
    email: "anisha@goinggenius.com",
    role: "QA Tester",
    department: "Development",
    phone: "+977 9801000009",
    status: "Active",
    location: "Kathmandu, Nepal",
    experience: "3+ Years",
    bio: "Anisha is a detail-oriented QA tester who ensures every product meets the highest quality standards. She designs comprehensive test plans and catches bugs before they reach production.",
    skills: ["Manual Testing", "Automation Testing", "Selenium", "API Testing", "Bug Tracking", "Test Planning"],
    image: "/girl.png",
  },
  {
    fullName: "Kamal Jaishi",
    email: "kamal@goinggenius.com",
    role: "Full Stack Developer",
    department: "Development",
    phone: "+977 9801000010",
    status: "Active",
    location: "Kathmandu, Nepal",
    experience: "2+ Years",
    bio: "Kamal is an enthusiastic full stack developer who brings energy and fresh perspectives to the team. He is a quick learner and contributes effectively across frontend and backend tasks.",
    skills: ["React.js", "Node.js", "JavaScript", "Express.js", "MySQL", "Tailwind CSS"],
    image: "/Alex.png",
  },
];

async function main() {
  console.log("Seeding team members...");

  for (const member of teamMembers) {
    await prisma.team.upsert({
      where: { email: member.email },
      update: member,
      create: member,
    });
    console.log(`  ✓ ${member.fullName} (${member.role})`);
  }

  console.log("Done seeding team!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
