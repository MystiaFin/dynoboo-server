import { prisma } from "./db";
import * as bcrypt from "bcrypt";

export default async function seed(): Promise<void> {
  console.log("Starting seed operation...");

  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@email.com";

    const adminExist = await prisma.user.findFirst({
      where: { email: adminEmail },
    });

    if (adminExist) {
      console.log("Admin user already exists, skipping creation");
      return;
    }

    const adminName = process.env.ADMIN_NAME || "Admin User";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new Error("Admin password not provided in environment variables");
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        isAdmin: true,
        password: hashedPassword,
      },
    });

    console.log(`Admin user created successfully: ${adminEmail}`);
  } catch (error) {
    console.error("Seed operation failed:", error);
    throw error;
  }
}
