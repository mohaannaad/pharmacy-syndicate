-- CreateEnum
CREATE TYPE "AdPlacement" AS ENUM ('WEBSITE', 'HQ', 'BOTH');

-- CreateEnum
CREATE TYPE "AdStatus" AS ENUM ('DRAFT', 'UNDER_REVIEW', 'NEEDS_EDIT', 'APPROVED_AWAITING_PAYMENT', 'PAID', 'SCHEDULED', 'PUBLISHED', 'COMPLETED', 'REJECTED');

-- CreateTable
CREATE TABLE "Ad" (
    "id" TEXT NOT NULL,
    "placement" "AdPlacement" NOT NULL,
    "duration" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contactInfo" TEXT NOT NULL,
    "fileUrl" TEXT,
    "status" "AdStatus" NOT NULL DEFAULT 'DRAFT',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);
