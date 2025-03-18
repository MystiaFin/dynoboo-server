import { Request, Response } from "express";
import { prisma } from "../../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface LoginRequest {
  email: string;
  password: string;
}

export const userLogin = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        isAdmin: true,
      },
    });

    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
          email: user.email,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "48h",
        }
      );

      const { password, ...userWithoutPassword } = user;
      res
        .status(200)
        .json({
          user: userWithoutPassword,
          token,
          message: "Login successful",
        });
    } else {
      res.status(400).json({ error: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
