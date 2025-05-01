import { Request, Response } from "express";
import { prisma } from "../../db";
import bcrypt from "bcrypt";

interface OtpRequestBody {
  email: string;
}

export const generateOtp = async (
  req: Request<{}, {}, OtpRequestBody>,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      res.status(400).json({ error: "Valid email is required" });
      return;
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.unverifiedUser.upsert({
      where: { email },
      update: {
        otp: hashedOtp,
        expiresAt: otpExpiry,
      },
      create: {
        email,
        otp: hashedOtp,
        expiresAt: otpExpiry,
      },
    });

    // Don't send actual OTP in response in production
    // This is just for development/debugging
    if (process.env.NODE_ENV === "development") {
      res.status(200).json({
        message: "OTP generated successfully",
        email,
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      });
    } else {
      res.status(200).json({
        message: "OTP generated successfully",
        email,
      });
    }

    // TODO: Implement email sending functionality here
    // sendOtpEmail(email, otp);
  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
