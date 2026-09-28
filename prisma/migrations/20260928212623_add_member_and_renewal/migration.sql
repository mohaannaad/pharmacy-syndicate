-- CreateEnum
CREATE TYPE "CardDelivery" AS ENUM ('DELIVERY', 'PICKUP');

-- CreateEnum
CREATE TYPE "RenewalStatus" AS ENUM ('AWAITING_PAYMENT', 'RECEIVED', 'UNDER_REVIEW', 'ISSUED', 'DELIVERED', 'REJECTED');

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "membershipNumber" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "photoUrl" TEXT,
    "lastPaidYear" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RenewalRequest" (
    "id" TEXT NOT NULL,
    "serial" SERIAL NOT NULL,
    "memberId" TEXT NOT NULL,
    "years" INTEGER[],
    "subscriptionTotal" INTEGER NOT NULL,
    "lateTotal" INTEGER NOT NULL,
    "deliveryFee" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "photoUrl" TEXT,
    "deliveryMethod" "CardDelivery" NOT NULL,
    "deliveryAddress" TEXT,
    "status" "RenewalStatus" NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "adminNote" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RenewalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_membershipNumber_key" ON "Member"("membershipNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Member_nationalId_key" ON "Member"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "RenewalRequest_serial_key" ON "RenewalRequest"("serial");

-- AddForeignKey
ALTER TABLE "RenewalRequest" ADD CONSTRAINT "RenewalRequest_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
