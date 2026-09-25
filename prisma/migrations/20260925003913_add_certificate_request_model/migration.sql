-- CreateEnum
CREATE TYPE "CertificateType" AS ENUM ('GOOD_CONDUCT_AR', 'GOOD_CONDUCT_EN', 'MBA_ISLESCA', 'DBA_ISLESCA', 'MBA_NAVAL_ACADEMY', 'DBA_NAVAL_ACADEMY', 'DIPLOMA_NAVAL_ACADEMY', 'MBA_ARAB_ACADEMY', 'DBA_ARAB_ACADEMY');

-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('ELECTRONIC', 'DELIVERY', 'PICKUP');

-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('DRAFT', 'AWAITING_PAYMENT', 'PAID', 'UNDER_REVIEW', 'ISSUED', 'COMPLETED', 'REJECTED');

-- CreateTable
CREATE TABLE "CertificateRequest" (
    "id" TEXT NOT NULL,
    "type" "CertificateType" NOT NULL,
    "destination" TEXT,
    "attachments" TEXT[],
    "deliveryMethod" "DeliveryMethod" NOT NULL,
    "price" INTEGER NOT NULL,
    "memberName" TEXT NOT NULL,
    "membershipNumber" TEXT NOT NULL,
    "contactInfo" TEXT NOT NULL,
    "status" "CertificateStatus" NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CertificateRequest_pkey" PRIMARY KEY ("id")
);
