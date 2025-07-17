import { Request, Response } from "express";
import { prisma } from "../../db";

export const deleteProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        wishlists: true,
        cartItems: true,
      },
    });

    if (!existingProduct) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    const inUse =
      existingProduct.wishlists.length > 0 ||
      existingProduct.cartItems.length > 0;

    if (inUse) {
      res.status(409).json({
        success: false,
        message:
          "Cannot delete product as it is currently in use (in wishlists or carts)",
        details: {
          inWishlists: existingProduct.wishlists.length,
          inCarts: existingProduct.cartItems.length,
        },
      });
    }

    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: {
        id: deletedProduct.id,
        name: deletedProduct.name,
      },
    });
  } catch (error) {
    console.error("Error deleting product:", error);

    if (error instanceof Error) {
      if (error.message.includes("Foreign key constraint")) {
        res.status(409).json({
          success: false,
          message: "Cannot delete product due to existing references",
        });
      }

      if (error.message.includes("Record to delete does not exist")) {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};
