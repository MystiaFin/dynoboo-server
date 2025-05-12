import { Response, Request } from "express";
import { prisma } from "../../db";
import bcrypt from "bcrypt";

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export const userCreate = async (
  req: Request<{}, {}, CreateUserRequest>,
  res: Response,
): Promise<void> => {
  const { name, email, password } = req.body;
  const saltRounds: number = 10;

  const duplicateUser = await prisma.user.findUnique({
    where: { email },
  });

  if (duplicateUser) {
    res.status(400).json({ error: "User already exists" });
    return;
  }

  try {
    const defaultUsername = email.split("@")[0];
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name: defaultUsername,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create user or unverified entry" });
  }
};
