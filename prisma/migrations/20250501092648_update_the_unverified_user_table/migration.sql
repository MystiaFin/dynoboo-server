/*
  Warnings:

  - You are about to drop the column `password` on the `unverifiedUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "unverifiedUser" DROP COLUMN "password",
ALTER COLUMN "otp" DROP NOT NULL;
