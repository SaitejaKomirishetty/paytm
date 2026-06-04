/*
  Warnings:

  - You are about to drop the column `startTome` on the `OnRampTransaction` table. All the data in the column will be lost.
  - Added the required column `startTime` to the `OnRampTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OnRampTransaction" DROP COLUMN "startTome",
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;
