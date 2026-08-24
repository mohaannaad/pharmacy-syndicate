/*
  Warnings:

  - You are about to drop the column `description` on the `News` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NewsType" AS ENUM ('YOUTUBE', 'ARTICLE');

-- AlterTable
ALTER TABLE "News" DROP COLUMN "description",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "type" "NewsType" NOT NULL DEFAULT 'ARTICLE';
