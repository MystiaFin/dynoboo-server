import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare module "express" {
  export interface Request {
    id?: number;
  }
}

const JWT_SECRET = process.env.JWT_SECRET!;

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Check both cookie and authorization header
  let token = req.cookies.accessToken || req.cookies.token; // Cookie name should match what you set

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
    req.id = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
