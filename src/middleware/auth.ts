import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    if (!JWT_SECRET) {
      res.status(500).json({ error: "JWT secret is not defined." });
      return;
    }

    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Access denied. No token provided." });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    req.id = decoded.id;

    next();
  } catch (err) {
    console.error("Token Verification Error:", err);
    res.status(403).json({ error: "Invalid or expired token." });
  }
};
