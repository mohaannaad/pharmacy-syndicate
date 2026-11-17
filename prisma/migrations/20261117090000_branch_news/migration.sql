-- أخبار النقابات الفرعية: تصنيف لكل خبر (النقابة العامة / نقابة فرعية) + اسم النقابة الفرعية
-- (الأخبار الموجودة كلها بتفضل أخبار النقابة العامة — لا يتم حذف أي بيانات)

-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('MAIN', 'BRANCH');

-- AlterTable
ALTER TABLE "News" ADD COLUMN "category" "NewsCategory" NOT NULL DEFAULT 'MAIN',
ADD COLUMN "branchName" TEXT;
