import { Request, Response } from "express";
import { prisma } from "../../db";

export const getCartList = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const cartList = await prisma.cart.findMany({
      select: {
        id: true,
        userId: true,
      },
    });
    if (cartList.length === 0) {
      res.status(404).json({ success: false, message: "No carts found" });
      return;
    }
    res.status(200).json({ success: true, carts: cartList });
  } catch (error) {
    console.error("Error retrieving cart:", error);
    res.status(500).json({ success: false, error: "Failed to retrieve cart" });
    return;
  }
};

export const getCartByUserId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.id;

  if (!userId) {
    res.status(400).json({ success: false, error: "User ID is required" });
    return;
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        items: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      res.status(404).json({ success: false, message: "Cart not found" });
      return;
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error retrieving cart:", error);
    res.status(500).json({ success: false, error: "Failed to retrieve cart" });
  }
};
