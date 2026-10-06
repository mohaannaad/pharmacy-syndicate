-- AlterTable
ALTER TABLE "GraduateApplication" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "GraduateApplication" ADD CONSTRAINT "GraduateApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
