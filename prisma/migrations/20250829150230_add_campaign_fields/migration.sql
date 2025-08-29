/*
  Warnings:

  - Added the required column `category` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "images" JSONB,
ADD COLUMN     "location" TEXT;
