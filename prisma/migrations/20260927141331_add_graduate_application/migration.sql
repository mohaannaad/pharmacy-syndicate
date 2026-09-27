-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "UniversityType" AS ENUM ('GOVERNMENT', 'PRIVATE', 'FOREIGN');

-- CreateEnum
CREATE TYPE "GraduateStatus" AS ENUM ('AWAITING_PAYMENT', 'UNDER_REVIEW', 'NEEDS_COMPLETION', 'AWAITING_ORIGINALS', 'LICENSING', 'REGISTERED', 'REJECTED');

-- CreateTable
CREATE TABLE "GraduateApplication" (
    "id" TEXT NOT NULL,
    "serial" SERIAL NOT NULL,
    "fullNameAr" TEXT NOT NULL,
    "fullNameEn" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "nationality" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "birthGovernorate" TEXT NOT NULL,
    "idIssuer" TEXT NOT NULL,
    "governorate" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "buildingNo" TEXT NOT NULL,
    "apartment" TEXT,
    "landmark" TEXT,
    "universityType" "UniversityType" NOT NULL,
    "universityName" TEXT NOT NULL,
    "universityCountry" TEXT,
    "studyStartYear" INTEGER NOT NULL,
    "graduationYear" INTEGER NOT NULL,
    "studyYears" INTEGER NOT NULL,
    "grade" TEXT NOT NULL,
    "highSchoolType" TEXT NOT NULL,
    "highSchoolYear" INTEGER NOT NULL,
    "hasPreviousQualification" BOOLEAN NOT NULL DEFAULT false,
    "previousQualification" TEXT,
    "previousRejection" BOOLEAN NOT NULL DEFAULT false,
    "documents" JSONB NOT NULL,
    "declarationAccepted" BOOLEAN NOT NULL DEFAULT false,
    "fee" INTEGER,
    "status" "GraduateStatus" NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GraduateApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GraduateApplication_serial_key" ON "GraduateApplication"("serial");
