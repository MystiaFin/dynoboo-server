import { Response, Request } from "express";
import { prisma } from "@src/db";

export const getAllProducts = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(products);
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to retrieve products" });
  }
};
