/*
  Warnings:

  - You are about to drop the column `user_id` on the `Donation` table. All the data in the column will be lost.
  - Added the required column `donor_id` to the `Donation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_user_id_fkey";

-- AlterTable
ALTER TABLE "Donation" DROP COLUMN "user_id",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "donor_id" INTEGER NOT NULL,
ADD COLUMN     "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "stripePaymentIntentId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT,
ALTER COLUMN "isRecurring" SET DEFAULT false;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donor_id_fkey" FOREIGN KEY ("donor_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
