import { Request, Response } from "express";
import { prisma } from "../../db";

export const updateCartItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.id;

    if (!id) {
      res.status(400).json({
        success: false,
        error: "Cart item ID is required",
      });
      return;
    }

    if (!userId) {
      res.status(400).json({
        success: false,
        error: "User ID is required",
      });
      return;
    }

    if (!quantity || quantity <= 0) {
      res.status(400).json({
        success: false,
        error: "Quantity must be greater than 0",
      });
      return;
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: {
          userId,
        },
      },
      include: {
        product: true,
        cart: true,
      },
    });

    if (!existingCartItem) {
      res.status(404).json({
        success: false,
        error: "Cart item not found or does not belong to user",
      });
      return;
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: {
        product: true,
      },
    });

    res.status(200).json({
      success: true,
      item: updatedCartItem,
      message: "Cart item quantity updated successfully",
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update cart item",
    });
  }
};
