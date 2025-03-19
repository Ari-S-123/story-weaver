/*
  Warnings:

  - You are about to drop the column `description` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "description",
ADD COLUMN     "content" TEXT;
