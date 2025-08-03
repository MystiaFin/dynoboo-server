import { Request, Response } from "express";
import { prisma } from "../../db";

export const deleteCartItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Cart item ID is required",
      });
      return;
    }
    const deletedCartItem = await prisma.cartItem.delete({
      where: { id },
    });
    res.status(200).json({
      success: true,
      message: "Cart item deleted successfully",
      data: {
        id: deletedCartItem.id,
        productId: deletedCartItem.productId,
        quantity: deletedCartItem.quantity,
      },
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the cart item",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
