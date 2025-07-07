import { Response, Request } from "express";
import { prisma } from "../../db";

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
      },
    });

    res.status(200).json(products);
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to retrieve products" });
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const productId = req.params.id;

  if (!productId) {
    res.status(400).json({ error: "Product ID is required" });
    return;
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
      },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(200).json(product);
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to retrieve product" });
  }
};
