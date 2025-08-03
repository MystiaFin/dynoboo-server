import { Request, Response } from "express";
import { prisma } from "../../db";

export const createCartItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.id;

    // validate input
    if (!userId) {
      res.status(400).json({
        success: false,
        error: "User ID is required",
      });
      return;
    }

    if (!productId) {
      res.status(400).json({
        success: false,
        error: "Product ID is required",
      });
      return;
    }

    if (quantity <= 0) {
      res.status(400).json({
        success: false,
        error: "Quantity must be greater than 0",
      });
      return;
    }

    // find the product by ID
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      res.status(404).json({
        success: false,
        error: "Product not found",
      });
      return;
    }

    // find the cart that belongs to the user
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    // if cart does not exist, create a new one
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
      });
    }

    // validate if item already exists in the cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    let cartItem;

    if (existingCartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: quantity,
        },
        include: {
          product: true,
        },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price: product.price,
        },
        include: {
          product: true,
        },
      });
    }

    res.status(201).json({
      success: true,
      item: cartItem,
      message: existingCartItem
        ? "Item quantity updated successfully"
        : "Item added to cart successfully",
    });
  } catch (error) {
    console.error("Error creating cart item:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add item to cart",
    });
  }
};
