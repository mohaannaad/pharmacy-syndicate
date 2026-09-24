-- CreateEnum
CREATE TYPE "ComplaintCategory" AS ENUM ('MEMBERSHIP', 'CERTIFICATES_CARDS', 'SUBSCRIPTIONS', 'INSTALLMENTS_PROJECTS', 'TRIPS_COURSES_EVENTS', 'ADS', 'TECHNICAL_ISSUE', 'ADMINISTRATIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('RECEIVED', 'UNDER_REVIEW', 'NEEDS_INFO', 'TRANSFERRED', 'RESPONDED', 'CLOSED', 'REJECTED');

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "category" "ComplaintCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "attachments" TEXT[],
    "submitterName" TEXT NOT NULL,
    "submitterContact" TEXT NOT NULL,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'RECEIVED',
    "adminResponse" TEXT,
    "escalated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Complaint_ticketNumber_key" ON "Complaint"("ticketNumber");
