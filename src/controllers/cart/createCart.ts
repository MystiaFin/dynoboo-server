import { Request, Response } from "express";
import { prisma } from "../../db";

export const createCart = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.id;
    if (!userId) {
      res.status(400).json({ success: false, error: "User ID is required" });
      return;
    }

    const existingCart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (existingCart) {
      res.status(400).json({
        success: false,
        error: "Cart already exists for this user",
      });
      return;
    }

    const cart = await prisma.cart.create({
      data: {
        userId,
      },
    });
    res.status(201).json({
      success: true,
      cart,
      message: "Cart created successfully",
    });
  } catch (error) {
    console.error("Error creating cart:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create cart",
    });
  }
};
