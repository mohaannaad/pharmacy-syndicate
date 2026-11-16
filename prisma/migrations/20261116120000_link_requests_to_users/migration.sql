-- ربط طلبات الإعلانات والشكاوى والشهادات بحساب صاحبها + وقت آخر تحديث لكل طلب
-- (أعمدة جديدة فقط — لا يتم حذف أو تعديل أي بيانات موجودة)

-- AlterTable
ALTER TABLE "Ad" ADD COLUMN "userId" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN "userId" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "CertificateRequest" ADD COLUMN "userId" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "RenewalRequest" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- الطلبات القديمة: وقت آخر تحديث = وقت إنشائها (عشان ما تظهرش كإشعارات جديدة)
UPDATE "Ad" SET "updatedAt" = "createdAt";
UPDATE "Complaint" SET "updatedAt" = COALESCE("respondedAt", "createdAt");
UPDATE "CertificateRequest" SET "updatedAt" = "createdAt";
UPDATE "RenewalRequest" SET "updatedAt" = COALESCE("paidAt", "createdAt");

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateRequest" ADD CONSTRAINT "CertificateRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
