import { getRequiredDocuments, calculateFee, isNationalityAllowed, determinePrivateCategory } from "./graduate";

// =====================================================================
// التحقق من بيانات طلب القيد وتجهيزها للحفظ
// ---------------------------------------------------------------------
// بيستخدمها: إرسال طلب جديد، وإعادة إرسال طلب بعد "مطلوب استكمال".
// الرقم القومي والتليفون بييجوا من الحساب نفسه، مش من الفورم.
// =====================================================================

interface AccountInfo {
  nationalId: string;
  phone: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildGraduateApplication(body: any, account: AccountInfo, existingCategory: number | null = null) {
  // 1) الجنسيات المسموح بيها بس (مصري / فلسطيني / سوداني)
  if (!isNationalityAllowed(body.nationality)) {
    return { error: "لا يتم قيد الجنسيات الأجنبية بالنقابة باستثناء الجنسيتين الفلسطينية والسودانية" };
  }

  // 2) لازم يكون موافق على الإقرار
  if (!body.declarationAccepted) {
    return { error: "يجب الموافقة على إقرار صحة البيانات" };
  }

  // 3) كل المستندات المطلوبة لازم تكون مرفوعة (نفس القاعدة اللي في الفورم)
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
    return { error: `مستندات ناقصة: ${missing.map((d) => d.label).join("، ")}` };
  }

  // 4) الفئة والرسوم:
  //    - الحكومي: رسوم ثابتة فورًا
  //    - الخاص: الفئة بتتحدد تلقائيًا من نسبة الثانوية (لو سنتها موجودة في الجدول)
  //    - لو الموظف كان حدد فئة قبل كده ومفيش فئة تلقائية، بنحتفظ بفئته
  const graduationYear = Number(body.graduationYear);
  const highSchoolPercent = Number(body.highSchoolPercent) || null;
  const autoCategory =
    body.universityType === "PRIVATE" && highSchoolPercent
      ? determinePrivateCategory(body.universityName, Number(body.highSchoolYear), highSchoolPercent)
      : null;
  const category = autoCategory ?? (body.universityType === "GOVERNMENT" ? null : existingCategory);
  const fee = calculateFee(body.universityType, graduationYear, (category as 1 | 2 | 3 | null) ?? undefined);

  return {
    data: {
      fullNameAr: String(body.fullNameAr || "").trim(),
      fullNameEn: String(body.fullNameEn || "").trim(),
      nationalId: account.nationalId, // من الحساب
      phone: account.phone, // من الحساب
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
    },
  };
}