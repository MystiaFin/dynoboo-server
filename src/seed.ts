import { prisma } from "./db";
import * as bcrypt from "bcrypt";

export async function seed(): Promise<void> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      throw new Error("Admin email not provided in environment variables");
    }

    const adminExist = await prisma.user.count({
      where: { email: adminEmail },
    });
    if (adminExist > 0) {
      console.log("Admin user already exists, skipping creation");
      return;
    }

    const adminName = process.env.ADMIN_NAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new Error("Admin password not provided in environment variables");
    }

    const hashedPassword: string = await bcrypt.hash(adminPassword, 10);

    await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        isAdmin: true,
        password: hashedPassword,
      },
    });

    console.log(`Admin user created successfully: ${adminEmail}`);
  } catch (error: unknown) {
    console.error("Seed operation failed:", error);
    throw error;
  }
}
