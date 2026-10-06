-- CreateEnum
CREATE TYPE "MemberAccountStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "MemberAccountRequest" (
    "id" TEXT NOT NULL,
    "membershipNumber" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "oldPhone" TEXT NOT NULL,
    "newPhone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "idFrontUrl" TEXT NOT NULL,
    "idBackUrl" TEXT NOT NULL,
    "status" "MemberAccountStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberAccountRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MemberAccountRequest_nationalId_idx" ON "MemberAccountRequest"("nationalId");
