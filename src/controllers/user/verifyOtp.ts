import { Request, Response } from "express";
import { prisma } from "../../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export const verifyOtp = async (
  req: Request<{}, {}, VerifyOtpRequest>,
  res: Response,
): Promise<void> => {
  const { email, otp } = req.body;


}
)
