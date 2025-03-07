import { Response, Request } from "express";
import { prisma } from "../db";
import bcrypt from "bcrypt";

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    res.status(200).json(users);
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

export const createUser = async (
  req: Request<{}, {}, CreateUserRequest>,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;
  const saltRounds: number = 10;
  const duplicateUser = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (duplicateUser) {
    res.status(400).json({ error: "User already exists" });
  } else {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      const { password: _, ...userOutput } = newUser;
      res.status(201).json(userOutput);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
};
