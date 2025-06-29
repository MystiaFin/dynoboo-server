import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../db";

declare module "express" {
  export interface Request {
    id?: number;
  }
}

const JWT_SECRET = process.env.JWT_SECRET!;

export const authenticateJWTAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let token = req.cookies.accessToken || req.cookies.token;

  // If no cookie, check authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    res.status(401).json({ error: "Token missing or invalid" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, isAdmin: true },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!user.isAdmin) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    req.id = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
