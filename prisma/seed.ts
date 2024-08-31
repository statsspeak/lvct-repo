import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // Change this line

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error(
      "DEFAULT_ADMIN_PASSWORD must be set in environment variables"
    );
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10); // Change this line

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
