import { Response, Request } from "express";
import { prisma } from "@src/db";

export const userGet = async (_req: Request, res: Response): Promise<void> => {
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

export const userGetMe = async (req: Request, res: Response): Promise<void> => {
  const userId = req.id;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to retrieve user" });
  }
};
