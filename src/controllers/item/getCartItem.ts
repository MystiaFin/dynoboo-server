import { Request, Response } from "express";
import { prisma } from "../../db";

export const getCartItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.id;

    if (!userId) {
      res.status(400).json({
        success: false,
        error: "User ID is required",
      });
      return;
    }

    // find user's cart with all items and product details
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!cart) {
      res.status(200).json({
        success: true,
        cart: {
          id: null,
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
        message: "Cart is empty",
      });
      return;
    }

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + parseFloat(item.price.toString()) * item.quantity,
      0,
    );

    res.status(200).json({
      success: true,
      cart: {
        id: cart.id,
        items: cart.items,
        totalItems,
        totalPrice: Number(totalPrice.toFixed(2)),
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      },
      message: `Cart contains ${totalItems} item${totalItems !== 1 ? "s" : ""}`,
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch cart items",
    });
  }
};
