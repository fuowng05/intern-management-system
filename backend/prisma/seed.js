import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "../src/config/prisma.js";

async function main() {
  const passwordHash = await bcrypt.hash("Admin@123456", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@test.com",
    },
    update: {
      passwordHash,
      role: "admin",
    },
    create: {
      email: "admin@test.com",
      passwordHash,
      role: "admin",
    },
  });

  console.log("Admin created/updated:");
  console.log({
    id: admin.id,
    email: admin.email,
    role: admin.role,
  });
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });