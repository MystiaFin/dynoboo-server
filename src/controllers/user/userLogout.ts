import { Request, Response } from "express";

export const userLogout = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("accessToken", {
    httpOnly: true,
    ...(isProd && {
      sameSite: "none",
      secure: true,
      partitioned: true,
    }),
  });

  res.status(200).json({
    message: `User ${req.id} logged out successfully`,
    success: true,
  });
};
