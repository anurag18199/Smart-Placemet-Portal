import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@placement.com";
  const password = "Admin@123";
  const name = "Super Admin";

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log("✅ Admin already exists:", email);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin created successfully!");
  console.log("   Email   :", admin.email);
  console.log("   Password:", password);
  console.log("   Role    :", admin.role);
}

main()
  .catch((e) => {
    console.error("❌ Seeder failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });