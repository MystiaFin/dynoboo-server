import { prisma } from "./db";
import * as bcrypt from "bcrypt";

interface AdminEnvironmentVars {
  ADMIN_EMAIL: string;
  ADMIN_NAME?: string;
  ADMIN_PASSWORD: string;
}

function getAdminEnvVars(): AdminEnvironmentVars {
  const { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL) {
    throw new Error("Admin email not provided in environment variables");
  }

  if (!ADMIN_PASSWORD) {
    throw new Error("Admin password not provided in environment variables");
  }

  return {
    ADMIN_EMAIL,
    ADMIN_NAME,
    ADMIN_PASSWORD,
  };
}

export async function seed(): Promise<void> {
  try {
    const { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } = getAdminEnvVars();

    const adminExists: number = await prisma.user.count({
      where: { email: ADMIN_EMAIL },
    });

    if (adminExists > 0) {
      console.log("Admin user already exists, skipping creation");
      return;
    }

    const hashedPassword: string = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const createdUser = await prisma.user.create({
      data: {
        name: ADMIN_NAME ?? "Admin", // Nullish coalescing operator for default value
        email: ADMIN_EMAIL,
        isAdmin: true,
        password: hashedPassword,
      },
    });

    console.log(`Admin user created successfully: ${createdUser.email}`);
  } catch (error: unknown) {
    console.error(
      "Seed operation failed:",
      error instanceof Error ? error.message : String(error),
    );
    throw error;
  }
}
