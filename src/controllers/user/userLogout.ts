import { Request, Response } from "express";

export const userLogout = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    partitioned: true,
  });

  res.status(200).json({
    message: `User ${req.id} logged out successfully`,
    success: true,
  });
};
