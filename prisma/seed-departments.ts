import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding departments...");

  const departments = ["Leadership", "Development", "Design"];

  for (let i = 0; i < departments.length; i++) {
    await prisma.department.upsert({
      where: { name: departments[i] },
      update: { order: i },
      create: { name: departments[i], order: i },
    });
    console.log(`  ✓ ${departments[i]}`);
  }

  // Migrate any legacy "On Leave" status to "Inactive"
  const migrated = await prisma.team.updateMany({
    where: { status: "On Leave" },
    data: { status: "Inactive" },
  });
  if (migrated.count > 0) {
    console.log(`  ✓ Migrated ${migrated.count} team member(s) from "On Leave" to "Inactive"`);
  }

  console.log("Done seeding departments!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
