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
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [newUser, _unverifiedUser] = await prisma.$transaction([
      prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      }),
      prisma.unverifiedUser.create({
        data: {
          email,
        },
      }),
    ]);

    const { password: _, ...userOutput } = newUser;
    res.status(201).json(userOutput);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create user or unverified entry" });
  }
};
