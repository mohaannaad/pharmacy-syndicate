import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";
import { getRequiredDocuments, calculateFee, trackingNumber, isNationalityAllowed, determinePrivateCategory } from "../../lib/graduate";

// لوحة التحكم هتستخدمها بعدين لعرض كل الطلبات
export async function GET() {
  const applications = await prisma.graduateApplication.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(applications);
}

export async function POST(request: Request) {
  const body = await request.json();

  // 1) الرقم القومي لازم يكون 14 رقم
  if (!/^\d{14}$/.test(body.nationalId || "")) {
    return NextResponse.json({ error: "الرقم القومي لازم يكون 14 رقم" }, { status: 400 });
  }

  // 1-ب) الجنسيات المسموح بيها بس (مصري / فلسطيني / سوداني)
  if (!isNationalityAllowed(body.nationality)) {
    return NextResponse.json({ error: "لا يتم قيد الجنسيات الأجنبية بالنقابة باستثناء الجنسيتين الفلسطينية والسودانية" }, { status: 400 });
  }

  // 2) لازم يكون موافق على الإقرار
  if (!body.declarationAccepted) {
    return NextResponse.json({ error: "يجب الموافقة على إقرار صحة البيانات" }, { status: 400 });
  }

  // 3) نمنع إن نفس الرقم القومي يعمل طلبين مفتوحين
  const existing = await prisma.graduateApplication.findFirst({
    where: { nationalId: body.nationalId, status: { not: "REJECTED" } },
  });
  if (existing) {
    return NextResponse.json(
      { error: `يوجد طلب سابق بنفس الرقم القومي، رقم المتابعة: ${trackingNumber(existing.serial, existing.createdAt)}` },
      { status: 409 }
    );
  }

  // 4) نتأكد إن كل المستندات المطلوبة اترفعت (القاعدة نفسها اللي في الفورم)
  const required = getRequiredDocuments({
    universityType: body.universityType,
    universityName: body.universityName,
    gender: body.gender,
    nationality: body.nationality,
    studyYears: Number(body.studyYears),
    highSchoolType: body.highSchoolType,
    hasPreviousQualification: !!body.hasPreviousQualification,
    previousRejection: !!body.previousRejection,
  });
  const uploaded: Record<string, string> = body.documents || {};
  const missing = required.filter((d) => !uploaded[d.key]);
  if (missing.length > 0) {
    return NextResponse.json({ error: `مستندات ناقصة: ${missing.map((d) => d.label).join("، ")}` }, { status: 400 });
  }

   // 5) الفئة والرسوم:
  //    - الحكومي: رسوم ثابتة فورًا
  //    - الخاص: الفئة بتتحدد تلقائيًا من نسبة الثانوية (لو سنتها موجودة في الجدول)
  //    - الخارجي أو سنة مش في الجدول: الموظف يحدد الفئة وقت المراجعة
  const graduationYear = Number(body.graduationYear);
  const highSchoolPercent = Number(body.highSchoolPercent) || null;
  const category =
    body.universityType === "PRIVATE" && highSchoolPercent
      ? determinePrivateCategory(body.universityName, Number(body.highSchoolYear), highSchoolPercent)
      : null;
  const fee = calculateFee(body.universityType, graduationYear, category ?? undefined);

  const application = await prisma.graduateApplication.create({
    data: {
      fullNameAr: body.fullNameAr,
      fullNameEn: body.fullNameEn,
      nationalId: body.nationalId,
      phone: body.phone,
      email: body.email,
      gender: body.gender,
      nationality: body.nationality,
      religion: body.religion,
      birthDate: new Date(body.birthDate),
      birthGovernorate: body.birthGovernorate,
      idIssuer: body.idIssuer,

      governorate: body.governorate,
      city: body.city,
      district: body.district,
      street: body.street,
      buildingNo: body.buildingNo,
      apartment: body.apartment || null,
      landmark: body.landmark || null,

      universityType: body.universityType,
      universityName: body.universityName,
      universityCountry: body.universityCountry || null,
      studyStartYear: Number(body.studyStartYear),
      graduationYear,
      studyYears: Number(body.studyYears),
      grade: body.grade,
      highSchoolType: body.highSchoolType,
      highSchoolYear: Number(body.highSchoolYear),
            highSchoolScore: Number(body.highSchoolScore) || null,
      highSchoolPercent,
      hasPreviousQualification: !!body.hasPreviousQualification,
      previousQualification: body.previousQualification || null,
      previousRejection: !!body.previousRejection,

      documents: required.map((d) => ({ ...d, url: uploaded[d.key] })),
      declarationAccepted: true,
      category,
      fee,
      status: fee === null ? "UNDER_REVIEW" : "AWAITING_PAYMENT",
    },
  });

  return NextResponse.json({
    id: application.id,
    trackingNumber: trackingNumber(application.serial, application.createdAt),
    fee: application.fee,
    status: application.status,
  });
}