/*
  Warnings:

  - You are about to drop the column `userId` on the `Story` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Story" DROP COLUMN "userId",
ADD COLUMN     "ownerId" TEXT NOT NULL;
