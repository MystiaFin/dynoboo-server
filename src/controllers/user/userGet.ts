import { Response, Request } from "express";
import { prisma } from "../../db";

export const userGet = async (req: Request, res: Response): Promise<void> => {
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
